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
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message, preferredAppointment }: ContactEmailRequest = await req.json();

    console.log("Received contact form submission:", { name, email, phone, preferredAppointment });

    // Send notification email to the business
    const businessEmail = await resend.emails.send({
      from: "Junky Gurus <onboarding@resend.dev>",
      to: ["info@junkygurus.com"],
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

    // Send confirmation email to the customer
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
