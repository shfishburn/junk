import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
  preferredAppointment?: string;
  isBooking?: boolean;
  bookingDate?: string;
  bookingTime?: string;
  isHazmatRequest?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      name, 
      email, 
      phone, 
      message, 
      preferredAppointment,
      isBooking,
      bookingDate,
      bookingTime,
      isHazmatRequest
    }: ContactEmailRequest = await req.json();

    console.log("Received submission:", { name, email, phone, isBooking, bookingDate, bookingTime, isHazmatRequest });

    const adminEmail = "Junkygurus@gmail.com";

    if (isHazmatRequest) {
      // Parse hazmat items from message
      const messageLines = message.split('\n');
      const pickupAddress = messageLines.find(l => l.startsWith('Pickup Address:'))?.replace('Pickup Address:', '').trim() || 'Not provided';
      const materialsLine = messageLines.find(l => l.startsWith('Materials:'));
      const materialsIndex = messageLines.indexOf(materialsLine || '');
      const materialsText = materialsIndex >= 0 ? messageLines[materialsIndex]?.replace('Materials:', '').trim() : '';
      const additionalNotes = messageLines.find(l => l.startsWith('Additional Notes:'))?.replace('Additional Notes:', '').trim() || 'None';
      
      // Format materials as list items
      const materialsList = materialsText
        ? materialsText.split(', ').map(item => `<li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${item}</li>`).join('')
        : '<li>No specific items listed</li>';

      // Admin notification for hazmat
      const businessEmail = await resend.emails.send({
        from: "Junky Gurus <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `⚠️ HAZMAT Pickup Request from ${name}`,
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
              <tr><td style="padding: 8px 0;"><strong>Phone:</strong></td><td><a href="tel:${phone}">${phone || 'Not provided'}</a></td></tr>
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
      // Booking-specific emails
      const businessEmail = await resend.emails.send({
        from: "Junky Gurus <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `🗓️ New Booking from ${name} - ${bookingDate} at ${bookingTime}`,
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
            
            ${message ? `<h2 style="color: #374151;">Additional Notes</h2><p>${message}</p>` : ""}
            
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
      // Standard contact form emails
      const businessEmail = await resend.emails.send({
        from: "Junky Gurus <onboarding@resend.dev>",
        to: [adminEmail],
        subject: `New Quote Request from ${name}`,
        html: `
          <h1>New Quote Request</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          ${preferredAppointment ? `<p><strong>Preferred Appointment:</strong> ${preferredAppointment}</p>` : ""}
          <h2>Message:</h2>
          <p>${message}</p>
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
