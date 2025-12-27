import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Junk Guru, a friendly and helpful AI assistant for Junky Gurus LLC, a professional junk removal company based in Mount Vernon, WA serving the Puget Sound Region.

Your role is to help website visitors with:
- Understanding our services (residential junk removal, appliance hauling, yard waste, estate cleanouts, construction debris, commercial cleanouts, and light demolition)
- Answering questions about pricing (we charge by volume, not time - 1/8 truck ~$175, 1/4 truck ~$250, 1/2 truck ~$375, 3/4 truck ~$475, Full truck ~$575)
- Explaining our service areas (Skagit County, Whatcom County, Snohomish County, and parts of King County - within 50 miles of Mount Vernon)
- Guiding them to the right pages on the website
- Helping them understand what we can and cannot haul
- Encouraging them to get a free quote or call us at (360) 610-9233

Keep responses friendly, concise, and helpful. Use a casual but professional tone. If someone asks about scheduling or wants a specific quote, encourage them to:
1. Use our AI Estimator tool at /ai-estimator for a quick estimate
2. Contact us at (360) 610-9233 or info@junkygurus.com
3. Fill out the contact form at /contact

Items we DO haul: furniture, appliances, yard waste, construction debris, electronics, mattresses, hot tubs, sheds, fencing, etc.
Hazardous materials: We CAN handle certain hazmat items like paint, chemicals, and other hazardous materials! These require special handling and disposal, so we have a dedicated hazmat request form. Direct users to /services to learn more or to submit a hazmat request through our specialized form.
Items we DON'T haul: medical waste, radioactive materials, explosives.

Be enthusiastic about helping people declutter and mention that we donate usable items and recycle responsibly!`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat assistant error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
