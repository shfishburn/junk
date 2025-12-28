import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { z } from "https://esm.sh/zod@3.23.8";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 5; // Max 5 requests per minute per IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Clean up expired rate limit entries periodically
function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

// Check rate limit for an identifier (IP or email)
function checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const existing = rateLimitMap.get(identifier);
  
  // Clean up old entries occasionally
  if (rateLimitMap.size > 1000) {
    cleanupRateLimitMap();
  }
  
  if (!existing || now > existing.resetTime) {
    // First request or window expired - allow and start new window
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }
  
  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    // Rate limit exceeded
    const retryAfter = Math.ceil((existing.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  // Increment counter
  existing.count++;
  return { allowed: true };
}

// Get client IP from request headers
function getClientIP(req: Request): string {
  // Check common proxy headers
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  
  const realIP = req.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  
  const cfConnectingIP = req.headers.get("cf-connecting-ip");
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  
  return "unknown";
}

// Server-side validation schema matching client constraints
const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(20, "Phone must be less than 20 characters").optional().nullable(),
  message: z.string().trim().max(2000, "Message must be less than 2000 characters").optional().default(""),
  preferredAppointment: z.string().max(100, "Preferred appointment must be less than 100 characters").optional().nullable(),
  isBooking: z.boolean().optional().default(false),
  bookingDate: z.string().max(50, "Booking date must be less than 50 characters").optional().nullable(),
  bookingTime: z.string().max(20, "Booking time must be less than 20 characters").optional().nullable(),
  isHazmatRequest: z.boolean().optional().default(false),
  serviceType: z.string().max(50, "Service type must be less than 50 characters").optional().nullable(),
});

// HTML sanitization function to prevent XSS in email templates
function sanitizeHtml(input: string | undefined | null): string {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\n/g, "<br>");
}

// Sanitize for plain text (keeps newlines for parsing)
function sanitizeText(input: string | undefined | null): string {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const clientIP = getClientIP(req);
    const rateLimitResult = checkRateLimit(clientIP);
    
    if (!rateLimitResult.allowed) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ 
          error: "Too many requests. Please try again later.",
          retryAfter: rateLimitResult.retryAfter 
        }),
        { 
          status: 429, 
          headers: { 
            "Content-Type": "application/json", 
            "Retry-After": String(rateLimitResult.retryAfter),
            ...corsHeaders 
          } 
        }
      );
    }
    const rawData = await req.json();
    
    // Validate input with Zod
    const parseResult = contactSchema.safeParse(rawData);
    
    if (!parseResult.success) {
      console.error("Validation failed:", parseResult.error.flatten());
      return new Response(
        JSON.stringify({ 
          error: "Invalid input", 
          details: parseResult.error.flatten() 
        }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
    
    const validatedData = parseResult.data;
    
    // Sanitize all user inputs for HTML email templates
    const name = sanitizeHtml(validatedData.name);
    const email = validatedData.email; // Email is validated, keep for sending
    const phone = sanitizeHtml(validatedData.phone);
    const message = validatedData.message || "";
    const preferredAppointment = sanitizeHtml(validatedData.preferredAppointment);
    const isBooking = validatedData.isBooking;
    const bookingDate = sanitizeHtml(validatedData.bookingDate);
    const bookingTime = sanitizeHtml(validatedData.bookingTime);
    const isHazmatRequest = validatedData.isHazmatRequest;

    console.log("Validated submission:", { 
      name: validatedData.name, 
      email, 
      phone: validatedData.phone, 
      isBooking, 
      bookingDate: validatedData.bookingDate, 
      bookingTime: validatedData.bookingTime, 
      isHazmatRequest 
    });

    const adminEmail = "Junkygurus@gmail.com";

    if (isHazmatRequest) {
      // Parse hazmat items from message (sanitize for parsing, then sanitize output)
      const sanitizedMessage = sanitizeText(message);
      const messageLines = message.split('\n');
      const pickupAddress = sanitizeHtml(messageLines.find(l => l.startsWith('Pickup Address:'))?.replace('Pickup Address:', '').trim() || 'Not provided');
      const materialsLine = messageLines.find(l => l.startsWith('Materials:'));
      const materialsIndex = messageLines.indexOf(materialsLine || '');
      const materialsText = materialsIndex >= 0 ? messageLines[materialsIndex]?.replace('Materials:', '').trim() : '';
      const additionalNotes = sanitizeHtml(messageLines.find(l => l.startsWith('Additional Notes:'))?.replace('Additional Notes:', '').trim() || 'None');
      
      // Format materials as list items (sanitize each item)
      const materialsList = materialsText
        ? materialsText.split(', ').map(item => `<li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${sanitizeHtml(item)}</li>`).join('')
        : '<li>No specific items listed</li>';

      // Admin notification for hazmat
      // TODO: Switch back to bookings@junkygurus.com once Resend fully propagates domain verification
      const businessEmail = await resend.emails.send({
        from: "Junky Gurus <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `⚠️ HAZMAT Pickup Request from ${validatedData.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 20px;">
              <h1 style="color: #92400e; margin: 0; font-size: 24px;">⚠️ Hazardous Materials Pickup Request</h1>
            </div>
            
            <div style="background: #fef9c3; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #854d0e;">📦 Materials to Pick Up</h2>
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${materialsList}
              </ul>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #374151;">📍 Pickup Details</h2>
              <p style="margin: 0;"><strong>Address:</strong> ${pickupAddress}</p>
              ${preferredAppointment ? `<p style="margin: 8px 0 0 0;"><strong>Preferred Date/Time:</strong> ${preferredAppointment}</p>` : ''}
            </div>
            
            <h2 style="color: #374151;">👤 Customer Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0;"><strong>Name:</strong></td><td>${name}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Email:</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
              <tr><td style="padding: 8px 0;"><strong>Phone:</strong></td><td><a href="tel:${validatedData.phone || ''}">${phone || 'Not provided'}</a></td></tr>
            </table>
            
            ${additionalNotes !== 'None' ? `
              <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <h3 style="margin-top: 0; color: #374151;">📝 Additional Notes</h3>
                <p style="margin: 0;">${additionalNotes}</p>
              </div>
            ` : ''}
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                ⚠️ Remember: Verify items are acceptable for transport before confirming pickup.
              </p>
            </div>
          </div>
        `,
      });

      console.log("Admin hazmat notification sent:", businessEmail);

      // Customer confirmation for hazmat
      const customerEmail = await resend.emails.send({
        from: "Junky Gurus <onboarding@resend.dev>",
        to: [email],
        subject: "Your Hazmat Pickup Request is Received! ♻️",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #16a34a;">Thanks for your hazmat pickup request, ${name}!</h1>
            <p>We've received your request to pick up hazardous materials and we're on it!</p>
            
            <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
              <h2 style="margin-top: 0; color: #166534;">📦 Your Items</h2>
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${materialsList}
              </ul>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0;">📍 Pickup Location</h2>
              <p style="margin: 0;">${pickupAddress}</p>
              ${preferredAppointment ? `<p style="margin: 8px 0 0 0;"><strong>Preferred time:</strong> ${preferredAppointment}</p>` : ''}
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #92400e;">What happens next?</h2>
              <ul>
                <li>We'll review your request within 24 hours</li>
                <li>We'll confirm the items and provide a final quote</li>
                <li>Once approved, we'll schedule your pickup</li>
                <li>We'll safely transport everything to certified disposal facilities</li>
              </ul>
            </div>
            
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">💡 Prep Tips</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Keep items in original containers when possible</li>
                <li>Make sure lids are secure</li>
                <li>Keep items accessible for easy pickup</li>
              </ul>
            </div>
            
            <p><strong>Questions?</strong> Give us a call at <strong>(360) 610-9233</strong></p>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">— The Junky Gurus Team</p>
          </div>
        `,
      });

      console.log("Customer hazmat confirmation sent:", customerEmail);
    } else if (isBooking && bookingDate && bookingTime) {
      const sanitizedMessage = sanitizeHtml(message);
      
      // Booking-specific emails
      const businessEmail = await resend.emails.send({
        from: "Junky Gurus <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `🗓️ New Booking from ${validatedData.name} - ${validatedData.bookingDate} at ${validatedData.bookingTime}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #16a34a;">New Booking Request</h1>
            
            <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
              <h2 style="margin-top: 0; color: #166534;">📅 Appointment Details</h2>
              <p style="font-size: 18px; margin: 0;"><strong>Date:</strong> ${bookingDate}</p>
              <p style="font-size: 18px; margin: 8px 0 0 0;"><strong>Time:</strong> ${bookingTime}</p>
            </div>
            
            <h2 style="color: #374151;">Customer Information</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
            
            ${sanitizedMessage ? `<h2 style="color: #374151;">Additional Notes</h2><p>${sanitizedMessage}</p>` : ""}
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">— Junky Gurus Booking System</p>
          </div>
        `,
      });

      console.log("Admin booking notification sent:", businessEmail);

      const customerEmail = await resend.emails.send({
        from: "Junky Gurus <onboarding@resend.dev>",
        to: [email],
        subject: "Your Booking is Confirmed! 🗓️",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #16a34a;">Booking Confirmed!</h1>
            <p>Hey ${name}, your junk removal appointment is all set!</p>
            
            <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
              <h2 style="margin-top: 0; color: #166534;">📅 Your Appointment</h2>
              <p style="font-size: 18px; margin: 0;"><strong>Date:</strong> ${bookingDate}</p>
              <p style="font-size: 18px; margin: 8px 0 0 0;"><strong>Time:</strong> ${bookingTime}</p>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0;">What to Expect</h2>
              <ul>
                <li>Our team will arrive during your scheduled time slot</li>
                <li>We'll assess your items and provide a final quote</li>
                <li>Once approved, we'll haul everything away!</li>
              </ul>
            </div>
            
            <p><strong>Need to reschedule or cancel?</strong></p>
            <p>Give us a call at <strong>(360) 610-9233</strong> at least 24 hours before your appointment.</p>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">— The Junky Gurus Team</p>
          </div>
        `,
      });

      console.log("Customer booking confirmation sent:", customerEmail);
    } else {
      const sanitizedMessage = sanitizeHtml(message);
      
      // Standard contact form emails
      const businessEmail = await resend.emails.send({
        from: "Junky Gurus <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `New Quote Request from ${validatedData.name}`,
        html: `
          <h1>New Quote Request</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          ${preferredAppointment ? `<p><strong>Preferred Appointment:</strong> ${preferredAppointment}</p>` : ""}
          <h2>Message:</h2>
          <p>${sanitizedMessage}</p>
        `,
      });

      console.log("Business notification email sent:", businessEmail);

      const customerEmail = await resend.emails.send({
        from: "Junky Gurus <onboarding@resend.dev>",
        to: [email],
        subject: "We Got Your Junk Request! 🗑️",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #16a34a;">Thanks for reaching out, ${name}!</h1>
            <p>We've received your quote request and we're already getting excited about your junk (yes, we're weird like that).</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0;">What happens next?</h2>
              <ul>
                <li>We'll review your request within 24 hours</li>
                <li>One of our junk experts will reach out to discuss details</li>
                <li>We'll schedule a time that works for you</li>
              </ul>
            </div>
            
            ${preferredAppointment ? `<p><strong>Your preferred time:</strong> ${preferredAppointment}</p>` : ""}
            
            <p>Can't wait? Give us a call at <strong>(360) 610-9233</strong></p>
            
            <p style="color: #6b7280; font-size: 14px;">— The Junky Gurus Team</p>
          </div>
        `,
      });

      console.log("Customer confirmation email sent:", customerEmail);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
