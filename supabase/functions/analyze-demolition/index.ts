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
    const { imageBase64, recalculateStructures } = body;
    
    // Either image analysis or recalculation with edited structures
    if (!imageBase64 && !recalculateStructures) {
      return new Response(
        JSON.stringify({ error: "No image or structures provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // If recalculating with edited structures (no image needed)
    if (recalculateStructures && recalculateStructures.length > 0) {
      console.log("Recalculating demolition estimate with edited structures:", recalculateStructures);
      
      const structuresList = recalculateStructures.map((s: { name: string; material: string; condition: string; estimatedSize: string }) => 
        `${s.name} (${s.material}, ${s.condition}, ~${s.estimatedSize})`
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
              content: `You are a light demolition expert for Junky Gurus. The customer has edited their structures list. Recalculate the demolition estimate.
              Base pricing guidelines:
              - Small projects (1-2 hours): $250-500
              - Medium projects (3-5 hours): $500-1,000
              - Large projects (full day): $1,000-2,000
              - Multi-day projects: $2,000+`,
            },
            {
              role: "user",
              content: `Recalculate the demolition estimate for these structures: ${structuresList}. Provide updated labor, debris, and price estimates.`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "analyze_demolition",
                description: "Provide demolition estimates for the given structures",
                parameters: {
                  type: "object",
                  properties: {
                    projectType: { type: "string" },
                    structures: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                          material: { type: "string" },
                          condition: { type: "string", enum: ["good", "weathered", "damaged", "rotted"] },
                          estimatedSize: { type: "string" },
                        },
                        required: ["name", "material", "condition", "estimatedSize"],
                        additionalProperties: false,
                      },
                    },
                    scopeOfWork: {
                      type: "object",
                      properties: {
                        complexity: { type: "string", enum: ["simple", "moderate", "complex"] },
                        estimatedHours: { type: "number" },
                        crewSize: { type: "number" },
                        equipmentNeeded: { type: "array", items: { type: "string" } },
                      },
                      required: ["complexity", "estimatedHours", "crewSize", "equipmentNeeded"],
                      additionalProperties: false,
                    },
                    debrisEstimate: {
                      type: "object",
                      properties: {
                        volume: { type: "number" },
                        weight: { type: "number" },
                        truckLoads: { type: "number" },
                        disposalNotes: { type: "string" },
                      },
                      required: ["volume", "weight", "truckLoads", "disposalNotes"],
                      additionalProperties: false,
                    },
                    priceEstimate: {
                      type: "object",
                      properties: {
                        laborMin: { type: "number" },
                        laborMax: { type: "number" },
                        disposalMin: { type: "number" },
                        disposalMax: { type: "number" },
                        totalMin: { type: "number" },
                        totalMax: { type: "number" },
                        currency: { type: "string", enum: ["USD"] },
                      },
                      required: ["laborMin", "laborMax", "disposalMin", "disposalMax", "totalMin", "totalMax", "currency"],
                      additionalProperties: false,
                    },
                    confidence: { type: "string", enum: ["low", "medium", "high"] },
                    notes: { type: "string" },
                    safetyConsiderations: { type: "array", items: { type: "string" } },
                    recommendations: { type: "array", items: { type: "string" } },
                  },
                  required: ["projectType", "structures", "scopeOfWork", "debrisEstimate", "priceEstimate", "confidence", "notes", "safetyConsiderations", "recommendations"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "analyze_demolition" } },
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
      if (!toolCall || toolCall.function.name !== "analyze_demolition") {
        throw new Error("Invalid AI response format");
      }

      const analysis = JSON.parse(toolCall.function.arguments);
      console.log("Recalculated demolition analysis:", JSON.stringify(analysis, null, 2));

      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Original image analysis flow
    console.log("Analyzing demolition project with AI...");

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
            content: `You are a light demolition expert for Junky Gurus, a professional junk removal and light demolition service in Washington State. 
            Analyze the image and estimate the demolition project scope, labor, materials to remove, and pricing.
            Be helpful and slightly humorous in your notes. 
            
            Light demolition services we offer:
            - Deck and patio removal
            - Shed and playhouse teardown
            - Fence removal
            - Flooring removal
            - Cabinet removal
            - Small structure demolition
            
            Base pricing guidelines:
            - Small projects (1-2 hours): $250-500
            - Medium projects (3-5 hours): $500-1,000
            - Large projects (full day): $1,000-2,000
            - Multi-day projects: $2,000+
            
            Factors that affect price:
            - Size and complexity of structure
            - Material type (wood, concrete, composite)
            - Accessibility
            - Disposal requirements
            - Heavy equipment needs`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this image for a light demolition project. Identify what needs to be demolished, estimate the scope of work, labor hours, and provide a price range for the demolition and removal.",
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
              name: "analyze_demolition",
              description: "Analyze a demolition project from an image and provide estimates",
              parameters: {
                type: "object",
                properties: {
                  projectType: {
                    type: "string",
                    description: "Type of demolition project (e.g., 'Deck Removal', 'Fence Removal', 'Shed Demolition')",
                  },
                  structures: {
                    type: "array",
                    description: "List of structures/items identified for demolition",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Name of the structure" },
                        material: { type: "string", description: "Primary material (wood, concrete, metal, composite)" },
                        condition: { type: "string", enum: ["good", "weathered", "damaged", "rotted"], description: "Condition of the structure" },
                        estimatedSize: { type: "string", description: "Estimated dimensions or size" },
                      },
                      required: ["name", "material", "condition", "estimatedSize"],
                      additionalProperties: false,
                    },
                  },
                  scopeOfWork: {
                    type: "object",
                    description: "Scope of the demolition work",
                    properties: {
                      complexity: { type: "string", enum: ["simple", "moderate", "complex"], description: "Project complexity" },
                      estimatedHours: { type: "number", description: "Estimated labor hours" },
                      crewSize: { type: "number", description: "Recommended crew size" },
                      equipmentNeeded: { type: "array", items: { type: "string" }, description: "Equipment needed" },
                    },
                    required: ["complexity", "estimatedHours", "crewSize", "equipmentNeeded"],
                    additionalProperties: false,
                  },
                  debrisEstimate: {
                    type: "object",
                    description: "Estimated debris from demolition",
                    properties: {
                      volume: { type: "number", description: "Estimated cubic yards of debris" },
                      weight: { type: "number", description: "Estimated weight in pounds" },
                      truckLoads: { type: "number", description: "Estimated number of truck loads" },
                      disposalNotes: { type: "string", description: "Notes about disposal (recyclable, landfill, etc.)" },
                    },
                    required: ["volume", "weight", "truckLoads", "disposalNotes"],
                    additionalProperties: false,
                  },
                  priceEstimate: {
                    type: "object",
                    description: "Estimated price range for the project",
                    properties: {
                      laborMin: { type: "number", description: "Minimum labor cost in USD" },
                      laborMax: { type: "number", description: "Maximum labor cost in USD" },
                      disposalMin: { type: "number", description: "Minimum disposal cost in USD" },
                      disposalMax: { type: "number", description: "Maximum disposal cost in USD" },
                      totalMin: { type: "number", description: "Minimum total cost in USD" },
                      totalMax: { type: "number", description: "Maximum total cost in USD" },
                      currency: { type: "string", enum: ["USD"], description: "Currency" },
                    },
                    required: ["laborMin", "laborMax", "disposalMin", "disposalMax", "totalMin", "totalMax", "currency"],
                    additionalProperties: false,
                  },
                  confidence: {
                    type: "string",
                    enum: ["low", "medium", "high"],
                    description: "Confidence level in the estimate",
                  },
                  notes: {
                    type: "string",
                    description: "Additional notes or observations about the project (keep it friendly and slightly humorous)",
                  },
                  safetyConsiderations: {
                    type: "array",
                    description: "Safety considerations for the project",
                    items: { type: "string" },
                  },
                  recommendations: {
                    type: "array",
                    description: "Recommendations for the customer",
                    items: { type: "string" },
                  },
                },
                required: ["projectType", "structures", "scopeOfWork", "debrisEstimate", "priceEstimate", "confidence", "notes", "safetyConsiderations", "recommendations"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_demolition" } },
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
    if (!toolCall || toolCall.function.name !== "analyze_demolition") {
      throw new Error("Invalid AI response format");
    }

    const analysis = JSON.parse(toolCall.function.arguments);
    console.log("Parsed analysis:", JSON.stringify(analysis, null, 2));

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-demolition function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Failed to analyze image" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
