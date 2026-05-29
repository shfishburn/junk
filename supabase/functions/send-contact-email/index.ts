import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { z } from "https://esm.sh/zod@3.23.8";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const senderEmail = "Junky Gurus <booking@thejunkygurus.com>";
const replyToEmail = "contact@thejunkygurus.com";

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
  isCancellation: z.boolean().optional().default(false),
  isCompletion: z.boolean().optional().default(false),
  bookingDate: z.string().max(50, "Booking date must be less than 50 characters").optional().nullable(),
  bookingTime: z.string().max(20, "Booking time must be less than 20 characters").optional().nullable(),
  isHazmatRequest: z.boolean().optional().default(false),
  isCurbSubscription: z.boolean().optional().default(false),
  trashDay: z.string().max(20, "Trash day must be less than 20 characters").optional().nullable(),
  serviceType: z.string().max(100, "Service type must be less than 100 characters").optional().nullable(),
  address: z.string().max(500, "Address must be less than 500 characters").optional().nullable(),
  skipAdminNotification: z.boolean().optional().default(false),
  photoUrls: z.array(z.string().url()).max(10).optional(),
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

// Branded email header template
function emailHeader(): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
      <!-- Header with Logo -->
      <div style="text-align: center; padding: 30px 20px 20px 20px;">
        <a href="https://thejunkygurus.com" target="_blank" style="text-decoration: none;">
          <img src="https://thejunkygurus.com/logo.png" alt="Junky Gurus" style="max-width: 180px; height: auto;" />
        </a>
      </div>
      <!-- Green accent bar -->
      <div style="height: 4px; background: linear-gradient(90deg, #16a34a, #22c55e); margin: 0 20px 30px 20px; border-radius: 2px;"></div>
      <!-- Content wrapper -->
      <div style="padding: 0 20px;">
  `;
}

// Branded email footer template
function emailFooter(): string {
  const currentYear = new Date().getFullYear();
  return `
      </div>
      <!-- Footer -->
      <div style="margin-top: 40px; padding: 30px 20px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
        <!-- Social Media Links -->
        <div style="text-align: center; margin-bottom: 20px;">
          <a href="https://www.instagram.com/junkygurus/" target="_blank" style="display: inline-block; margin: 0 10px; text-decoration: none;">
            <img src="https://cdn-icons-png.flaticon.com/24/174/174855.png" alt="Instagram" style="width: 24px; height: 24px;" />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61584519197833" target="_blank" style="display: inline-block; margin: 0 10px; text-decoration: none;">
            <img src="https://cdn-icons-png.flaticon.com/24/733/733547.png" alt="Facebook" style="width: 24px; height: 24px;" />
          </a>
        </div>
        <!-- Contact Info -->
        <div style="text-align: center; margin-bottom: 15px;">
          <p style="margin: 0; color: #374151; font-size: 14px;">
            <a href="tel:+13606109233" style="color: #16a34a; text-decoration: none; font-weight: 600;">(360) 610-9233</a>
            <span style="color: #9ca3af; margin: 0 10px;">|</span>
            <a href="mailto:junkygurus@gmail.com" style="color: #16a34a; text-decoration: none;">junkygurus@gmail.com</a>
          </p>
        </div>
        <!-- Location -->
        <div style="text-align: center; margin-bottom: 20px;">
          <p style="margin: 0; color: #6b7280; font-size: 13px;">
            📍 Serving Mount Vernon, WA &amp; Skagit County
          </p>
        </div>
        <!-- Copyright -->
        <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            © ${currentYear} Junky Gurus. All rights reserved.
          </p>
          <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 11px;">
            <a href="https://thejunkygurus.com" target="_blank" style="color: #9ca3af; text-decoration: underline;">thejunkygurus.com</a>
          </p>
        </div>
      </div>
    </div>
  `;
}

function customerTextEmail(name: string, requestType: string, details: string[] = []): string {
  return [
    `Hi ${name},`,
    "",
    `We've received your ${requestType} request.`,
    ...details.filter(Boolean).flatMap((detail) => ["", detail]),
    "",
    "What happens next:",
    "- We'll review your request within 24 hours.",
    "- One of our junk experts will reach out to confirm the details.",
    "- You can reply to this email or call/text (360) 610-9233 if you need anything.",
    "",
    "Thanks!",
    "Junky Gurus",
    "https://thejunkygurus.com",
  ].join("\n");
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawData = await req.json();
    
    // Validate input with Zod first
    const parseResult = contactSchema.safeParse(rawData);
    
    if (!parseResult.success) {
      console.error("Validation failed:", parseResult.error.flatten());
      return new Response(
        JSON.stringify({ 
          error: "Invalid input", 
          details: parseResult.error.flatten(),
          stage: "validation"
        }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }
    
    const validatedData = parseResult.data;
    
    // Rate limiting check - use email as fallback if IP is unknown
    const clientIP = getClientIP(req);
    const rateLimitIdentifier = clientIP !== "unknown" ? clientIP : validatedData.email;
    const rateLimitResult = checkRateLimit(rateLimitIdentifier);
    
    if (!rateLimitResult.allowed) {
      console.warn(`Rate limit exceeded for: ${rateLimitIdentifier}`);
      return new Response(
        JSON.stringify({ 
          error: "Too many requests. Please try again later.",
          retryAfter: rateLimitResult.retryAfter,
          stage: "rate_limit"
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
    
    // Sanitize all user inputs for HTML email templates
    const name = sanitizeHtml(validatedData.name);
    const email = validatedData.email; // Email is validated, keep for sending
    const phone = sanitizeHtml(validatedData.phone);
    const message = validatedData.message || "";
    const preferredAppointment = sanitizeHtml(validatedData.preferredAppointment);
    const isBooking = validatedData.isBooking;
    const isCancellation = validatedData.isCancellation;
    const isCompletion = validatedData.isCompletion;
    const bookingDate = sanitizeHtml(validatedData.bookingDate);
    const bookingTime = sanitizeHtml(validatedData.bookingTime);
    const isHazmatRequest = validatedData.isHazmatRequest;
    const isCurbSubscription = validatedData.isCurbSubscription;
    const trashDay = sanitizeHtml(validatedData.trashDay);
    const serviceType = sanitizeHtml(validatedData.serviceType);
    const skipAdminNotification = validatedData.skipAdminNotification;
    const pickupAddress = sanitizeHtml(validatedData.address);
    const photoUrls = validatedData.photoUrls || [];

    console.log("Validated submission:", { 
      name: validatedData.name, 
      email, 
      phone: validatedData.phone, 
      isBooking,
      isCancellation,
      isCompletion, 
      bookingDate: validatedData.bookingDate, 
      bookingTime: validatedData.bookingTime, 
      isHazmatRequest,
      isCurbSubscription,
      trashDay: validatedData.trashDay,
      serviceType: validatedData.serviceType,
      skipAdminNotification 
    });

    const adminEmail = "junkygurus@gmail.com";

    // Handle Trash Can to Curb subscription requests
    if (isCurbSubscription) {
      // Admin notification for curb subscription
      const businessEmail = await resend.emails.send({
        from: senderEmail,
        reply_to: replyToEmail,
        to: [adminEmail],
        subject: `🗑️ New Trash Can to Curb Subscription - ${validatedData.name}`,
        html: `
          ${emailHeader()}
            <div style="background: #dbeafe; padding: 15px; border-radius: 8px; border-left: 4px solid #2563eb; margin-bottom: 20px;">
              <h1 style="color: #1e40af; margin: 0; font-size: 24px;">🗑️ New Curb Service Subscription</h1>
            </div>
            
            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #1e40af;">📋 Subscription Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0;"><strong>Plan:</strong></td><td>${serviceType || 'Not specified'}</td></tr>
                <tr><td style="padding: 8px 0;"><strong>Trash Day:</strong></td><td style="color: #16a34a; font-weight: bold;">${trashDay || 'Not specified'}</td></tr>
              </table>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #374151;">📍 Service Address</h2>
              <p style="margin: 0;">${pickupAddress || 'Not provided'}</p>
              ${pickupAddress ? `
                <p style="margin: 12px 0 0 0;">
                  <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(validatedData.address || '')}" target="_blank" style="display: inline-block; background: #16a34a; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; margin-right: 8px;">🧭 Google Maps</a>
                  <a href="https://maps.apple.com/?daddr=${encodeURIComponent(validatedData.address || '')}" target="_blank" style="display: inline-block; background: #374151; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;"> Apple Maps</a>
                </p>
              ` : ''}
            </div>
            
            <h2 style="color: #374151;">👤 Customer Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0;"><strong>Name:</strong></td><td>${name}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Email:</strong></td><td><a href="mailto:${email}" style="color: #16a34a;">${email}</a></td></tr>
              <tr><td style="padding: 8px 0;"><strong>Phone:</strong></td><td>${phone || 'Not provided'}</td></tr>
            </table>
            ${validatedData.phone ? `
              <p style="margin: 12px 0 0 0;">
                <a href="tel:${validatedData.phone}" style="display: inline-block; background: #2563eb; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; margin-right: 8px;">📞 Call Customer</a>
                <a href="sms:${validatedData.phone}" style="display: inline-block; background: #7c3aed; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">💬 Text Customer</a>
              </p>
            ` : ''}
            
            ${sanitizeHtml(validatedData.message) ? `
              <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <h3 style="margin-top: 0; color: #374151;">📝 Additional Notes</h3>
                <p style="margin: 0;">${sanitizeHtml(validatedData.message)}</p>
              </div>
            ` : ''}
            
            <div style="margin-top: 30px; padding: 15px; background: #dbeafe; border-radius: 8px;">
              <p style="color: #1e40af; font-size: 12px; margin: 0;">
                🗑️ Remember to confirm the service start date and payment method with the customer.
              </p>
            </div>
          ${emailFooter()}
        `,
      });

      console.log("Admin curb subscription notification sent:", businessEmail);

      // Helper to get plan details for customer email
      const getPlanDetails = (plan: string) => {
        const plans: Record<string, { name: string; price: string; frequency: string; description: string }> = {
          'curb-weekly': { name: 'Weekly Service', price: '$40/month', frequency: 'Every Week', description: 'We handle your bins every trash day, rain or shine.' },
          'curb-biweekly': { name: 'Bi-Weekly Service', price: '$25/month', frequency: 'Every Other Week', description: 'Perfect for smaller households or those who don\'t fill bins often.' },
          'curb-onetime': { name: 'One-Time Service', price: '$15', frequency: 'Single Visit', description: 'Just need help once? We\'ve got you covered.' },
        };
        return plans[plan] || { name: plan || 'Selected Plan', price: 'To be confirmed', frequency: 'To be confirmed', description: '' };
      };
      
      const planDetails = getPlanDetails(validatedData.serviceType || '');

      // Customer confirmation for curb subscription
      const customerEmail = await resend.emails.send({
        from: senderEmail,
        reply_to: replyToEmail,
        to: [email],
        subject: "Your Trash Can to Curb Subscription Request! 🗑️",
        text: customerTextEmail(name, "Trash Can to Curb subscription", [
          `Service plan: ${planDetails.name}`,
          `Trash day: ${trashDay || 'To be confirmed'}`,
          pickupAddress ? `Service location: ${pickupAddress}` : "",
        ]),
        html: `
          ${emailHeader()}
            <h1 style="color: #16a34a; margin-top: 0;">Thanks for signing up, ${name}!</h1>
            <p style="font-size: 16px; line-height: 1.6;">We've received your <strong>Trash Can to Curb</strong> subscription request and we're excited to take trash day off your plate!</p>
            
            <div style="background: #dcfce7; padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 5px solid #16a34a;">
              <h2 style="margin: 0 0 20px 0; color: #166534; font-size: 20px;">📋 Your Subscription Summary</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #bbf7d0; color: #374151;"><strong>Service Plan:</strong></td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #bbf7d0; color: #166534; font-weight: bold; font-size: 16px;">${planDetails.name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #bbf7d0; color: #374151;"><strong>Price:</strong></td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #bbf7d0; color: #16a34a; font-weight: bold; font-size: 18px;">${planDetails.price}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #bbf7d0; color: #374151;"><strong>Frequency:</strong></td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #bbf7d0; color: #374151;">${planDetails.frequency}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #bbf7d0; color: #374151;"><strong>Your Trash Day:</strong></td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #bbf7d0; color: #166534; font-weight: bold;">${trashDay || 'To be confirmed'}</td>
                </tr>
              </table>
              
              ${planDetails.description ? `<p style="margin: 15px 0 0 0; color: #166534; font-style: italic; font-size: 14px;">${planDetails.description}</p>` : ''}
            </div>
            
            ${pickupAddress ? `
              <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3 style="margin: 0 0 10px 0; color: #374151; font-size: 16px;">📍 Service Location</h3>
                <p style="margin: 0; font-size: 15px; color: #1f2937;">${pickupAddress}</p>
              </div>
            ` : ''}
            
            <div style="background: #fefce8; padding: 20px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #eab308;">
              <h2 style="margin: 0 0 15px 0; color: #854d0e; font-size: 18px;">⏳ What Happens Next?</h2>
              <ol style="margin: 0; padding-left: 20px; color: #713f12;">
                <li style="margin-bottom: 8px;">We'll review your request within <strong>24 hours</strong></li>
                <li style="margin-bottom: 8px;">We'll call or text to confirm your <strong>service start date</strong></li>
                <li style="margin-bottom: 8px;">We'll set up your <strong>payment method</strong></li>
                <li style="margin-bottom: 0;">Then sit back — <strong>we've got your bins covered!</strong></li>
              </ol>
            </div>
            
            <div style="background: #eff6ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h2 style="margin: 0 0 15px 0; color: #1e40af; font-size: 18px;">🗑️ How Our Service Works</h2>
              <ul style="margin: 0; padding-left: 20px; color: #1e3a8a;">
                <li style="margin-bottom: 8px;">We arrive on your trash day morning and take your bins to the curb</li>
                <li style="margin-bottom: 8px;">After pickup, we return them to your garage or designated spot</li>
                <li style="margin-bottom: 0;">That's it — <strong>you never touch your bins again!</strong></li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f0fdf4; border-radius: 10px;">
              <p style="margin: 0 0 10px 0; color: #374151;"><strong>Questions about your subscription?</strong></p>
              <p style="margin: 0;">
                <a href="tel:+13606109233" style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-right: 10px;">📞 Call (360) 610-9233</a>
              </p>
              <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 13px;">or reply directly to this email</p>
            </div>
          ${emailFooter()}
        `,
      });

      console.log("Customer curb subscription confirmation sent:", customerEmail);
    } else if (isHazmatRequest) {
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

      // Build photos HTML for hazmat email
      const hazmatPhotosHtml = photoUrls.length > 0 ? `
        <div style="margin: 20px 0;">
          <h2 style="color: #374151;">📷 Customer Photos</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${photoUrls.map((url, i) => `
              <a href="${url}" target="_blank" style="display: block;">
                <img src="${url}" alt="Photo ${i + 1}" style="width: 150px; height: 150px; object-fit: cover; border-radius: 8px; border: 1px solid #e5e7eb;" />
              </a>
            `).join('')}
          </div>
        </div>
      ` : '';

      // Admin notification for hazmat
      const businessEmail = await resend.emails.send({
        from: senderEmail,
        reply_to: replyToEmail,
        to: [adminEmail],
        subject: `⚠️ HAZMAT Pickup Request from ${validatedData.name}${photoUrls.length > 0 ? ' 📷' : ''}`,
        html: `
          ${emailHeader()}
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
              ${pickupAddress ? `
                <p style="margin: 12px 0 0 0;">
                  <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(pickupAddress)}" target="_blank" style="display: inline-block; background: #16a34a; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; margin-right: 8px;">🧭 Google Maps</a>
                  <a href="https://maps.apple.com/?daddr=${encodeURIComponent(pickupAddress)}" target="_blank" style="display: inline-block; background: #374151; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;"> Apple Maps</a>
                </p>
              ` : ''}
            </div>
            
            <h2 style="color: #374151;">👤 Customer Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0;"><strong>Name:</strong></td><td>${name}</td></tr>
              <tr><td style="padding: 8px 0;"><strong>Email:</strong></td><td><a href="mailto:${email}" style="color: #16a34a;">${email}</a></td></tr>
              <tr><td style="padding: 8px 0;"><strong>Phone:</strong></td><td>${phone || 'Not provided'}</td></tr>
            </table>
            ${validatedData.phone ? `
              <p style="margin: 12px 0 0 0;">
                <a href="tel:${validatedData.phone}" style="display: inline-block; background: #2563eb; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; margin-right: 8px;">📞 Call Customer</a>
                <a href="sms:${validatedData.phone}" style="display: inline-block; background: #7c3aed; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">💬 Text Customer</a>
              </p>
            ` : ''}
            
            ${hazmatPhotosHtml}
            
            ${additionalNotes !== 'None' ? `
              <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <h3 style="margin-top: 0; color: #374151;">📝 Additional Notes</h3>
                <p style="margin: 0;">${additionalNotes}</p>
              </div>
            ` : ''}
            
            <div style="margin-top: 30px; padding: 15px; background: #fef3c7; border-radius: 8px;">
              <p style="color: #92400e; font-size: 12px; margin: 0;">
                ⚠️ Remember: Verify items are acceptable for transport before confirming pickup.
              </p>
            </div>
          ${emailFooter()}
        `,
      });

      console.log("Admin hazmat notification sent:", businessEmail);

      // Customer confirmation for hazmat
      const customerEmail = await resend.emails.send({
        from: senderEmail,
        reply_to: replyToEmail,
        to: [email],
        subject: "Your Hazmat Pickup Request is Received! ♻️",
        text: customerTextEmail(name, "hazmat pickup", [
          `Pickup location: ${pickupAddress}`,
          preferredAppointment ? `Preferred time: ${preferredAppointment}` : "",
        ]),
        html: `
          ${emailHeader()}
            <h1 style="color: #16a34a; margin-top: 0;">Thanks for your hazmat pickup request, ${name}!</h1>
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
          ${emailFooter()}
        `,
      });

      console.log("Customer hazmat confirmation sent:", customerEmail);
    } else if (isBooking && bookingDate && bookingTime) {
      const sanitizedMessage = sanitizeHtml(message);
      
      // Handle cancellation emails
      if (isCancellation) {
        const customerEmail = await resend.emails.send({
          from: senderEmail,
          reply_to: replyToEmail,
          to: [email],
          subject: "Your Booking Has Been Cancelled",
          text: customerTextEmail(name, "booking cancellation", [
            `Cancelled appointment: ${bookingDate} at ${bookingTime}`,
          ]),
          html: `
            ${emailHeader()}
              <h1 style="color: #dc2626; margin-top: 0;">Booking Cancelled</h1>
              <p>Hey ${name}, we're sorry to see you go!</p>
              
              <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                <h2 style="margin-top: 0; color: #991b1b;">❌ Cancelled Appointment</h2>
                <p style="font-size: 18px; margin: 0;"><strong>Date:</strong> ${bookingDate}</p>
                <p style="font-size: 18px; margin: 8px 0 0 0;"><strong>Time:</strong> ${bookingTime}</p>
              </div>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0;">Need to Reschedule?</h2>
                <p>No worries! We're here whenever you're ready. You can:</p>
                <ul>
                  <li>Book a new appointment at <a href="https://thejunkygurus.com/book" style="color: #16a34a;">thejunkygurus.com/book</a></li>
                  <li>Call us at <strong>(360) 610-9233</strong></li>
                  <li>Text us at <strong>(360) 610-9233</strong></li>
                </ul>
              </div>
              
              <p>We hope to help you haul your junk soon!</p>
            ${emailFooter()}
          `,
        });

        console.log("Customer cancellation email sent:", customerEmail);
      } else if (isCompletion) {
        // Handle completion emails
        const customerEmail = await resend.emails.send({
          from: senderEmail,
          reply_to: replyToEmail,
          to: [email],
          subject: "Thanks for Choosing Junky Gurus! 🎉",
          text: customerTextEmail(name, "completed booking", [
            `Completed appointment: ${bookingDate} at ${bookingTime}`,
          ]),
          html: `
            ${emailHeader()}
              <h1 style="color: #16a34a; margin-top: 0;">Job Complete! 🎉</h1>
              <p>Hey ${name}, thanks for letting us haul your junk!</p>
              
              <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
                <h2 style="margin-top: 0; color: #166534;">✅ Completed Appointment</h2>
                <p style="font-size: 18px; margin: 0;"><strong>Date:</strong> ${bookingDate}</p>
                <p style="font-size: 18px; margin: 8px 0 0 0;"><strong>Time:</strong> ${bookingTime}</p>
              </div>
              
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <h2 style="margin-top: 0; color: #92400e;">⭐ Love Our Service?</h2>
                <p>We'd be thrilled if you could share your experience! Your reviews help other folks find us.</p>
                <p style="margin-bottom: 0;">
                  <a href="https://g.page/r/CdqCw3DZwCCLEAE/review" style="display: inline-block; background: #16a34a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Leave a Google Review</a>
                </p>
              </div>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0;">Got More Junk?</h2>
                <p>We're always here when you need us! Book your next pickup:</p>
                <ul>
                  <li>Online at <a href="https://thejunkygurus.com/book" style="color: #16a34a;">thejunkygurus.com/book</a></li>
                  <li>Call us at <strong>(360) 610-9233</strong></li>
                  <li>Text us at <strong>(360) 610-9233</strong></li>
                </ul>
              </div>
              
              <p>Thanks again for being awesome! 🙌</p>
            ${emailFooter()}
          `,
        });

        console.log("Customer completion email sent:", customerEmail);
      } else {
        // Only send admin notification if not skipped (e.g., admin-created bookings skip this)
        if (!skipAdminNotification) {
          // Build photos HTML for email
          const photosHtml = photoUrls.length > 0 ? `
            <div style="margin: 20px 0;">
              <h2 style="color: #374151;">📷 Customer Photos</h2>
              <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                ${photoUrls.map((url, i) => `
                  <a href="${url}" target="_blank" style="display: block;">
                    <img src="${url}" alt="Photo ${i + 1}" style="width: 150px; height: 150px; object-fit: cover; border-radius: 8px; border: 1px solid #e5e7eb;" />
                  </a>
                `).join('')}
              </div>
            </div>
          ` : '';

          const businessEmail = await resend.emails.send({
            from: senderEmail,
            reply_to: replyToEmail,
            to: [adminEmail],
            subject: `🗓️ New Booking from ${validatedData.name} - ${validatedData.bookingDate} at ${validatedData.bookingTime}${photoUrls.length > 0 ? ' 📷' : ''}`,
            html: `
              ${emailHeader()}
                <h1 style="color: #16a34a; margin-top: 0;">New Booking Request</h1>
                
                <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
                  <h2 style="margin-top: 0; color: #166534;">📅 Appointment Details</h2>
                  <p style="font-size: 18px; margin: 0;"><strong>Date:</strong> ${bookingDate}</p>
                  <p style="font-size: 18px; margin: 8px 0 0 0;"><strong>Time:</strong> ${bookingTime}</p>
                  <p style="font-size: 18px; margin: 8px 0 0 0;"><strong>📍 Address:</strong> ${pickupAddress || 'Not provided'}</p>
                  ${pickupAddress ? `
                    <p style="margin: 12px 0 0 0;">
                      <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(validatedData.address || '')}" target="_blank" style="display: inline-block; background: #16a34a; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; margin-right: 8px;">🧭 Google Maps</a>
                      <a href="https://maps.apple.com/?daddr=${encodeURIComponent(validatedData.address || '')}" target="_blank" style="display: inline-block; background: #374151; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;"> Apple Maps</a>
                    </p>
                  ` : ''}
                </div>
                
                <h2 style="color: #374151;">Customer Information</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #16a34a;">${email}</a></p>
                <p style="margin-bottom: 12px;"><strong>Phone:</strong> ${phone || "Not provided"}</p>
                ${validatedData.phone ? `
                  <p style="margin: 0;">
                    <a href="tel:${validatedData.phone}" style="display: inline-block; background: #2563eb; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; margin-right: 8px;">📞 Call Customer</a>
                    <a href="sms:${validatedData.phone}" style="display: inline-block; background: #7c3aed; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">💬 Text Customer</a>
                  </p>
                ` : ''}
                
                ${photosHtml}
                
                ${sanitizedMessage ? `<h2 style="color: #374151;">Additional Notes</h2><p>${sanitizedMessage}</p>` : ""}
              ${emailFooter()}
            `,
          });

          console.log("Admin booking notification sent:", businessEmail);
        } else {
          console.log("Skipping admin notification (admin-created booking)");
        }

        const customerEmail = await resend.emails.send({
          from: senderEmail,
          reply_to: replyToEmail,
          to: [email],
          subject: "Your Booking is Confirmed! 🗓️",
          text: customerTextEmail(name, "booking", [
            `Appointment: ${bookingDate} at ${bookingTime}`,
            pickupAddress ? `Address: ${pickupAddress}` : "",
          ]),
          html: `
            ${emailHeader()}
              <h1 style="color: #16a34a; margin-top: 0;">Booking Confirmed!</h1>
              <p>Hey ${name}, your junk removal appointment is all set!</p>
              
              <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
                <h2 style="margin-top: 0; color: #166534;">📅 Your Appointment</h2>
                <p style="font-size: 18px; margin: 0;"><strong>Date:</strong> ${bookingDate}</p>
                <p style="font-size: 18px; margin: 8px 0 0 0;"><strong>Time:</strong> ${bookingTime}</p>
                ${pickupAddress ? `<p style="font-size: 18px; margin: 8px 0 0 0;"><strong>📍 Address:</strong> ${pickupAddress}</p>` : ''}
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
            ${emailFooter()}
          `,
        });

        console.log("Customer booking confirmation sent:", customerEmail);
      }
    } else {
      const sanitizedMessage = sanitizeHtml(message);
      
      // Build photos HTML for contact form email
      const contactPhotosHtml = photoUrls.length > 0 ? `
        <div style="margin: 20px 0;">
          <h2 style="color: #374151;">📷 Customer Photos</h2>
          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            ${photoUrls.map((url, i) => `
              <a href="${url}" target="_blank" style="display: block;">
                <img src="${url}" alt="Photo ${i + 1}" style="width: 150px; height: 150px; object-fit: cover; border-radius: 8px; border: 1px solid #e5e7eb;" />
              </a>
            `).join('')}
          </div>
        </div>
      ` : '';

      // Standard contact form emails
      const businessEmail = await resend.emails.send({
        from: senderEmail,
        reply_to: replyToEmail,
        to: [adminEmail],
        subject: `New Quote Request from ${validatedData.name}${photoUrls.length > 0 ? ' 📷' : ''}`,
        html: `
          ${emailHeader()}
            <h1 style="color: #16a34a; margin-top: 0;">New Quote Request</h1>

            <div style="background: #dcfce7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
              <h2 style="margin-top: 0; color: #166534;">📍 Service Details</h2>
              <p style="font-size: 18px; margin: 0;"><strong>📍 Address:</strong> ${pickupAddress || 'Not provided'}</p>
              ${preferredAppointment ? `<p style="font-size: 18px; margin: 8px 0 0 0;"><strong>Preferred Appointment:</strong> ${preferredAppointment}</p>` : ""}
              ${pickupAddress ? `
                <p style="margin: 12px 0 0 0;">
                  <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(validatedData.address || '')}" target="_blank" style="display: inline-block; background: #16a34a; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; margin-right: 8px;">🧭 Google Maps</a>
                  <a href="https://maps.apple.com/?daddr=${encodeURIComponent(validatedData.address || '')}" target="_blank" style="display: inline-block; background: #374151; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;"> Apple Maps</a>
                </p>
              ` : ''}
            </div>

            <h2 style="color: #374151;">Customer Information</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #16a34a;">${email}</a></p>
            <p style="margin-bottom: 12px;"><strong>Phone:</strong> ${phone || "Not provided"}</p>
            ${validatedData.phone ? `
              <p style="margin: 0;">
                <a href="tel:${validatedData.phone}" style="display: inline-block; background: #2563eb; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; margin-right: 8px;">📞 Call Customer</a>
                <a href="sms:${validatedData.phone}" style="display: inline-block; background: #7c3aed; color: white; padding: 10px 16px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">💬 Text Customer</a>
              </p>
            ` : ''}

            <h2 style="color: #374151;">📝 Message</h2>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #16a34a;">
              <p style="margin: 0;">${sanitizedMessage}</p>
            </div>
            
            ${contactPhotosHtml}
          ${emailFooter()}
        `,
      });

      console.log("Business notification email sent:", businessEmail);

      const customerEmail = await resend.emails.send({
        from: senderEmail,
        reply_to: replyToEmail,
        to: [email],
        subject: "We Got Your Junk Request! 🗑️",
        text: customerTextEmail(name, "quote", [
          pickupAddress ? `Service address: ${pickupAddress}` : "",
          preferredAppointment ? `Preferred time: ${preferredAppointment}` : "",
        ]),
        html: `
          ${emailHeader()}
            <h1 style="color: #16a34a; margin-top: 0;">Thanks for reaching out, ${name}!</h1>
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
          ${emailFooter()}
        `,
      });

      console.log("Customer confirmation email sent:", customerEmail);
    }

    return new Response(JSON.stringify({ 
      success: true,
      type: isCurbSubscription ? 'curb' : isHazmatRequest ? 'hazmat' : isBooking ? 'booking' : 'contact',
      skipAdminNotification: skipAdminNotification || false,
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stage: "send_email",
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
