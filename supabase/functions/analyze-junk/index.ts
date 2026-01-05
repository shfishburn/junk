import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { imageBase64, recalculateItems } = body;
    
    // Either image analysis or recalculation with edited items
    if (!imageBase64 && !recalculateItems) {
      return new Response(
        JSON.stringify({ error: "No image or items provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // If recalculating with edited items (no image needed)
    if (recalculateItems && recalculateItems.length > 0) {
      console.log("Recalculating estimate with edited items:", recalculateItems);
      
      const itemsList = recalculateItems.map((item: { name: string; quantity: number; condition: string }) => 
        `${item.quantity}x ${item.name} (${item.condition})`
      ).join(", ");

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content: `You are a junk removal pricing expert for Junky Gurus in Washington State.
              Recalculate the estimate based on the edited items list.
              
              PRICING STRATEGY:
              1. For 1-3 single items: Use SINGLE ITEM pricing (sum individual items)
              2. For 4+ items or large volumes: Use TRUCK LOAD pricing based on total volume
              3. Always use whichever method gives the HIGHER price (minimum viable rate)
              
              SINGLE ITEM PRICES (use for small jobs):
              - Couch/Sofa/Sectional: $75-150 (large sectionals up to $200)
              - Loveseat: $60-100
              - Mattress (any size): $50-100
              - Box Spring: $40-75
              - Recliner/Armchair: $50-85
              - Office Chair: $25-50
              - Dining Table: $50-100
              - Dining Chairs (each): $15-30
              - Desk: $50-100
              - Dresser/Chest: $50-100
              - Nightstand: $25-50
              - Bookshelf: $35-75
              - TV (any size): $35-75
              - Refrigerator/Freezer: $75-125
              - Washer or Dryer (each): $65-100
              - Dishwasher: $50-85
              - Microwave: $25-45
              - Stove/Oven: $65-100
              - Treadmill/Elliptical: $75-125
              - Exercise Bike: $50-85
              - Hot Tub: $300-500
              - Piano (upright): $200-350
              - Piano (grand): $350-500
              - Grill/BBQ: $50-100
              - Patio Furniture Set: $75-150
              - Swing Set: $150-300
              - Trampoline: $100-200
              - Shed (small): $200-400
              - Boxes/Bags (each): $10-25
              
              TRUCK LOAD PRICING (for larger jobs by volume):
              - Minimum Load (~5%, 1-2 small items): $125-190
              - 1/8 Truck (~12.5%): $190-250
              - 1/4 Truck (~25%): $250-375
              - 1/2 Truck (~50%): $375-500
              - 3/4 Truck (~75%): $500-625
              - Full Truck (100%): $625-815
              
              VOLUME GUIDE (cubic yards):
              - Couch: 1-1.5 cy, Mattress: 0.5-0.75 cy, Dresser: 0.5-0.75 cy
              - Refrigerator: 0.75-1 cy, Washer/Dryer: 0.5-0.75 cy each
              - Full truck = ~15 cubic yards
              
              WEIGHT SURCHARGES (add 10-20%):
              - Concrete/brick, safes, pianos, hot tubs, heavy appliances
              
              Be accurate and fair - don't overestimate or underestimate.`,
            },
            {
              role: "user",
              content: `Recalculate the junk removal estimate for these items: ${itemsList}. Calculate both single-item total and truck-load price, use the appropriate method.`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "analyze_junk",
                description: "Provide junk removal estimates for the given items",
                parameters: {
                  type: "object",
                  properties: {
                    items: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          quantity: { type: "number" },
                          condition: { type: "string", enum: ["good", "fair", "poor", "broken"] },
                        },
                        required: ["name", "quantity", "condition"],
                        additionalProperties: false,
                      },
                    },
                    estimatedVolume: {
                      type: "object",
                      properties: {
                        value: { type: "number" },
                        unit: { type: "string", enum: ["cubic_yards"] },
                        truckPercentage: { type: "number" },
                      },
                      required: ["value", "unit", "truckPercentage"],
                      additionalProperties: false,
                    },
                    estimatedWeight: {
                      type: "object",
                      properties: {
                        value: { type: "number" },
                        unit: { type: "string", enum: ["lbs"] },
                        category: { type: "string", enum: ["light", "medium", "heavy"] },
                      },
                      required: ["value", "unit", "category"],
                      additionalProperties: false,
                    },
                    priceEstimate: {
                      type: "object",
                      properties: {
                        min: { type: "number" },
                        max: { type: "number" },
                        currency: { type: "string", enum: ["USD"] },
                      },
                      required: ["min", "max", "currency"],
                      additionalProperties: false,
                    },
                    confidence: { type: "string", enum: ["low", "medium", "high"] },
                    notes: { type: "string" },
                    recommendations: { type: "array", items: { type: "string" } },
                  },
                  required: ["items", "estimatedVolume", "estimatedWeight", "priceEstimate", "confidence", "notes", "recommendations"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "analyze_junk" } },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("AI gateway error:", response.status, errorText);
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: "We're getting a lot of requests right now. Please try again in a moment." }),
            { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: "AI service temporarily unavailable. Please call us for a quote!" }),
            { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        throw new Error(`AI gateway error: ${response.status}`);
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall || toolCall.function.name !== "analyze_junk") {
        throw new Error("Invalid AI response format");
      }

      const analysis = JSON.parse(toolCall.function.arguments);
      console.log("Recalculated analysis:", JSON.stringify(analysis, null, 2));

      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Original image analysis flow
    console.log("Analyzing junk image with AI...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: `You are a junk removal pricing expert for Junky Gurus in Washington State.
            Analyze the image and provide accurate item identification and pricing.
            Be helpful and slightly humorous in your notes.
            
            PRICING STRATEGY:
            1. For 1-3 single items: Use SINGLE ITEM pricing (sum individual items)
            2. For 4+ items or large volumes: Use TRUCK LOAD pricing based on total volume
            3. Always use whichever method gives the HIGHER price (minimum viable rate)
            
            SINGLE ITEM PRICES (memorize these):
            - Couch/Sofa/Sectional: $75-150 (large sectionals up to $200)
            - Loveseat: $60-100
            - Mattress (any size): $50-100
            - Box Spring: $40-75
            - Recliner/Armchair: $50-85
            - Office Chair: $25-50
            - Dining Table: $50-100
            - Dining Chairs (each): $15-30
            - Desk: $50-100
            - Dresser/Chest: $50-100
            - Nightstand: $25-50
            - Bookshelf: $35-75
            - TV (any size): $35-75
            - Refrigerator/Freezer: $75-125
            - Washer or Dryer (each): $65-100
            - Dishwasher: $50-85
            - Microwave: $25-45
            - Stove/Oven: $65-100
            - Treadmill/Elliptical: $75-125
            - Exercise Bike: $50-85
            - Hot Tub: $300-500
            - Piano (upright): $200-350
            - Piano (grand): $350-500
            - Grill/BBQ: $50-100
            - Patio Furniture Set: $75-150
            - Swing Set: $150-300
            - Trampoline: $100-200
            - Shed (small): $200-400
            - Boxes/Bags (each): $10-25
            - Miscellaneous small items: $15-40
            
            TRUCK LOAD PRICING (for larger jobs):
            - Minimum Load (~5%, 1-2 small items): $125-190
            - 1/8 Truck (~12.5%): $190-250
            - 1/4 Truck (~25%): $250-375
            - 1/2 Truck (~50%): $375-500
            - 3/4 Truck (~75%): $500-625
            - Full Truck (100%): $625-815
            
            VOLUME REFERENCE (cubic yards):
            - Couch: 1-1.5 cy, Loveseat: 0.75 cy, Mattress: 0.5-0.75 cy
            - Dresser: 0.5-0.75 cy, Refrigerator: 0.75-1 cy
            - Washer/Dryer: 0.5-0.75 cy each, Desk: 0.5-0.75 cy
            - Boxes/Bags: 0.1-0.25 cy each
            - Full truck capacity = ~15 cubic yards
            
            WEIGHT SURCHARGES (add 10-20% for):
            - Concrete/brick, safes, pianos, hot tubs, cast iron
            
            IMPORTANT: Be accurate! Count items carefully, estimate sizes properly.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this image of items for junk removal. Identify the items, estimate their combined volume in cubic yards and truck percentage, estimate total weight, and provide a price range for removal.",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64,
                },
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_junk",
              description: "Analyze junk in an image and provide removal estimates",
              parameters: {
                type: "object",
                properties: {
                  items: {
                    type: "array",
                    description: "List of items identified in the image",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Name of the item" },
                        quantity: { type: "number", description: "Estimated quantity" },
                        condition: { type: "string", enum: ["good", "fair", "poor", "broken"], description: "Condition of the item" },
                      },
                      required: ["name", "quantity", "condition"],
                      additionalProperties: false,
                    },
                  },
                  estimatedVolume: {
                    type: "object",
                    description: "Estimated volume of all items",
                    properties: {
                      value: { type: "number", description: "Volume in cubic yards" },
                      unit: { type: "string", enum: ["cubic_yards"], description: "Unit of measurement" },
                      truckPercentage: { type: "number", description: "Percentage of a standard junk truck (0-100)" },
                    },
                    required: ["value", "unit", "truckPercentage"],
                    additionalProperties: false,
                  },
                  estimatedWeight: {
                    type: "object",
                    description: "Estimated total weight",
                    properties: {
                      value: { type: "number", description: "Weight in pounds" },
                      unit: { type: "string", enum: ["lbs"], description: "Unit of measurement" },
                      category: { type: "string", enum: ["light", "medium", "heavy"], description: "Weight category" },
                    },
                    required: ["value", "unit", "category"],
                    additionalProperties: false,
                  },
                  priceEstimate: {
                    type: "object",
                    description: "Estimated price range for removal",
                    properties: {
                      min: { type: "number", description: "Minimum price in USD" },
                      max: { type: "number", description: "Maximum price in USD" },
                      currency: { type: "string", enum: ["USD"], description: "Currency" },
                    },
                    required: ["min", "max", "currency"],
                    additionalProperties: false,
                  },
                  confidence: {
                    type: "string",
                    enum: ["low", "medium", "high"],
                    description: "Confidence level in the estimate",
                  },
                  notes: {
                    type: "string",
                    description: "Additional notes or observations about the items (keep it friendly and slightly humorous)",
                  },
                  recommendations: {
                    type: "array",
                    description: "Recommendations for the customer",
                    items: { type: "string" },
                  },
                },
                required: ["items", "estimatedVolume", "estimatedWeight", "priceEstimate", "confidence", "notes", "recommendations"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_junk" } },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "We're getting a lot of requests right now. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service temporarily unavailable. Please call us for a quote!" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received:", JSON.stringify(data, null, 2));

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== "analyze_junk") {
      throw new Error("Invalid AI response format");
    }

    const analysis = JSON.parse(toolCall.function.arguments);
    console.log("Parsed analysis:", JSON.stringify(analysis, null, 2));

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-junk function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to analyze image" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
