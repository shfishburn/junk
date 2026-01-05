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
              content: `You are a light demolition pricing expert for Junky Gurus. Recalculate based on the edited structures.
              
              STRUCTURE-SPECIFIC PRICING (labor + disposal included):
              - Small deck (under 100 sq ft): $500-800
              - Medium deck (100-200 sq ft): $800-1,250
              - Large deck (200-400 sq ft): $1,250-1,850
              - Extra large deck (400+ sq ft): $1,850-3,000
              - Small shed (under 64 sq ft): $375-625
              - Medium shed (64-120 sq ft): $625-1,050
              - Large shed (120+ sq ft): $1,050-1,750
              - Fence (per 50 linear ft): $250-500
              - Fence (100+ linear ft): $500-950
              - Playset/Swing Set: $375-700
              - Trampoline: $200-350
              - Hot Tub: $625-1,050
              - Gazebo (small): $500-950
              - Gazebo (large): $950-1,550
              - Pergola: $450-800
              - Patio/Concrete (per 100 sq ft): $500-950
              - Flooring removal (per 100 sq ft): $250-500
              - Cabinet removal (kitchen set): $375-700
              - Drywall removal (per room): $375-625
              - Bathroom demo (full): $700-1,250
              - Built-in shelving: $200-400
              - Stairs/railing: $300-575
              
              MATERIAL SURCHARGES:
              - Composite/Trex: +30-40%
              - Concrete: +35-55%
              - Pressure-treated lumber: +20-30%
              - Rotted/unsafe: +25-35%
              - Brick/stone: +30-45%
              
              DEBRIS DISPOSAL:
              - 1/4 Truck: $325-475
              - 1/2 Truck: $475-675
              - 3/4 Truck: $675-875
              - Full Truck: $875-1,100
              
              Calculate total = structure demolition cost + material surcharges + additional disposal.`,
            },
            {
              role: "user",
              content: `Recalculate the demolition estimate for these structures: ${structuresList}. Use the structure-specific pricing.`,
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
            content: `You are a light demolition pricing expert for Junky Gurus in Washington State.
            Analyze the image and provide accurate structure identification and pricing.
            Be helpful and slightly humorous in your notes.
            
            STRUCTURE IDENTIFICATION VOCABULARY (use these specific names):
            
            DECKS & PATIOS:
            - Small Deck, Medium Deck, Large Deck, Multi-Level Deck, Elevated Deck
            - Ground-Level Deck, Floating Deck, Pool Deck, Rooftop Deck
            - Wood Deck, Composite Deck, Trex Deck, Pressure-Treated Deck, Cedar Deck, Redwood Deck
            - Concrete Patio, Paver Patio, Brick Patio, Flagstone Patio, Stamped Concrete Patio
            - Covered Patio, Enclosed Patio, Screened Porch, Three-Season Porch
            - Deck Stairs, Deck Railing, Deck Boards, Deck Joists
            - Porch, Front Porch, Back Porch, Wrap-Around Porch, Farmer's Porch
            
            SHEDS & OUTBUILDINGS:
            - Small Shed, Medium Shed, Large Shed, Storage Shed
            - Garden Shed, Tool Shed, Potting Shed, Bike Shed
            - Wood Shed, Metal Shed, Plastic/Resin Shed, Vinyl Shed
            - Lean-To Shed, Barn-Style Shed, Gable Shed, Saltbox Shed
            - Playhouse, Kids Playhouse, Wooden Playhouse
            - Workshop, Small Workshop, Garage-Style Shed
            - Greenhouse, Hoop House, Cold Frame
            - Chicken Coop, Animal Shelter, Dog House (large)
            - Pump House, Well House
            - Outhouse, Privy
            
            FENCING & GATES:
            - Wood Fence, Cedar Fence, Pine Fence, Pressure-Treated Fence
            - Privacy Fence, Picket Fence, Split-Rail Fence, Board-on-Board Fence
            - Stockade Fence, Shadowbox Fence, Lattice Fence
            - Chain Link Fence, Metal Fence, Iron Fence, Wrought Iron Fence
            - Vinyl Fence, PVC Fence, Composite Fence
            - Farm Fence, Ranch Fence, Post-and-Rail Fence, Horse Fence
            - Fence Gate, Driveway Gate, Garden Gate, Arbor Gate
            - Fence Posts, Fence Panels, Fence Rails
            - Retaining Wall (small), Garden Wall, Block Wall, Timber Retaining Wall
            
            OUTDOOR STRUCTURES:
            - Gazebo (Small), Gazebo (Large), Octagonal Gazebo, Square Gazebo
            - Pergola, Arbor, Trellis, Garden Arch
            - Carport, Covered Parking Structure
            - Awning, Patio Cover, Shade Structure
            - Outdoor Kitchen, Built-In Grill Island
            - Fire Pit (built-in), Outdoor Fireplace, Pizza Oven
            - Hot Tub, Spa, Jacuzzi, Hot Tub Surround, Hot Tub Deck
            - Above Ground Pool, Pool Surround, Pool Deck, Pool Fence
            - Pond, Fountain, Water Feature
            
            PLAY EQUIPMENT:
            - Swing Set, Wooden Swing Set, Metal Swing Set
            - Playset, Jungle Gym, Play Structure, Climbing Structure
            - Slide, Tube Slide, Spiral Slide
            - Sandbox, Sandpit
            - Treehouse, Elevated Playhouse
            - Trampoline, In-Ground Trampoline
            - Basketball Hoop, Portable Basketball Goal, In-Ground Basketball Hoop
            - Batting Cage, Sport Court
            
            INTERIOR DEMOLITION:
            - Kitchen Cabinets, Upper Cabinets, Lower Cabinets, Cabinet Set
            - Bathroom Vanity, Vanity Cabinet
            - Built-In Shelving, Built-In Cabinets, Built-In Desk
            - Closet Shelving, Closet Organizer System
            - Flooring (Hardwood), Flooring (Laminate), Flooring (Tile), Flooring (Vinyl), Flooring (Carpet)
            - Tile Floor, Ceramic Tile, Porcelain Tile
            - Linoleum, Sheet Vinyl, VCT Tile
            - Drywall, Sheetrock, Plaster Walls, Lath and Plaster
            - Drop Ceiling, Suspended Ceiling, Ceiling Tiles
            - Popcorn Ceiling, Textured Ceiling
            - Interior Walls, Partition Walls, Non-Load-Bearing Walls
            - Fireplace Surround, Mantle, Hearth, Fireplace Insert
            - Bathtub, Shower Stall, Shower Enclosure, Glass Shower Door
            - Toilet, Sink, Pedestal Sink, Bathroom Fixtures
            - Countertop, Granite Countertop, Laminate Countertop, Tile Countertop
            - Backsplash, Tile Backsplash
            - Stairs, Staircase, Stair Railing, Banister
            - Doors, Interior Doors, Exterior Doors, French Doors, Sliding Door
            - Windows, Window Frames
            
            CONCRETE & MASONRY:
            - Concrete Slab, Concrete Pad, Concrete Walkway
            - Concrete Driveway, Asphalt Driveway
            - Concrete Steps, Concrete Stairs, Stoop
            - Concrete Block Wall, CMU Wall, Cinder Block Wall
            - Brick Wall, Brick Veneer, Brick Columns
            - Stone Wall, Flagstone, Pavers
            - Retaining Wall, Landscape Wall
            - Foundation (small section), Footer
            
            OTHER STRUCTURES:
            - Dock, Boat Dock, Floating Dock
            - Ramp, Wheelchair Ramp, Loading Ramp
            - Deck/Patio Furniture (built-in), Built-In Benches, Planters (built-in)
            - Light Posts, Lamp Posts, Mailbox Post
            - Flagpole, Sign Post, Utility Pole
            
            MATERIALS TO IDENTIFY:
            - Wood (Pine, Cedar, Redwood, Pressure-Treated, Painted, Stained)
            - Composite (Trex, TimberTech, Fiberon, Azek)
            - Metal (Steel, Aluminum, Iron, Wrought Iron, Chain Link)
            - Concrete (Poured, Block, Precast)
            - Brick (Standard, Pavers)
            - Stone (Natural, Manufactured, Flagstone, Slate)
            - Vinyl/PVC, Plastic, Resin
            - Tile (Ceramic, Porcelain, Natural Stone)
            
            CONDITIONS TO ASSESS:
            - Good: Solid, minimal wear, structurally sound
            - Weathered: Sun-faded, some wear, still solid
            - Damaged: Visible damage, broken parts, but mostly intact
            - Rotted: Wood rot, decay, unsafe, may crumble
            
            STRUCTURE-SPECIFIC PRICING (labor + disposal included):
            - Small deck (under 100 sq ft): $500-800
            - Medium deck (100-200 sq ft): $800-1,250
            - Large deck (200-400 sq ft): $1,250-1,850
            - Extra large deck (400+ sq ft): $1,850-3,000
            - Small shed (under 64 sq ft): $375-625
            - Medium shed (64-120 sq ft): $625-1,050
            - Large shed (120+ sq ft): $1,050-1,750
            - Fence (per 50 linear ft): $250-500
            - Fence (100+ linear ft): $500-950
            - Playset/Swing Set: $375-700
            - Trampoline: $200-350
            - Hot Tub removal: $625-1,050
            - Gazebo (small): $500-950
            - Gazebo (large): $950-1,550
            - Pergola: $450-800
            - Patio/Concrete (per 100 sq ft): $500-950
            - Flooring removal (per 100 sq ft): $250-500
            - Cabinet removal (kitchen set): $375-700
            - Drywall removal (per room): $375-625
            - Bathroom demolition (full): $700-1,250
            - Built-in shelving/closet organizer: $200-400
            - Interior door removal: $50-100 each
            - Stairs/railing removal: $300-575
            
            MATERIAL SURCHARGES (add to base price):
            - Composite/Trex decking: +30-40%
            - Concrete structures: +35-55%
            - Pressure-treated/heavy lumber: +20-30%
            - Rotted/unsafe structures: +25-35% (extra safety measures)
            - Second story or difficult access: +25-40%
            - Brick/stone: +30-45%
            
            DEBRIS DISPOSAL (if additional loads needed):
            - 1/4 Truck: $325-475
            - 1/2 Truck: $475-675
            - 3/4 Truck: $675-875
            - Full Truck: $875-1,100
            - Multiple loads: multiply accordingly
            
            EQUIPMENT VOCABULARY (use specific names from this list):
            
            HAND TOOLS - DEMOLITION:
            - Sledgehammer (10 lb), Sledgehammer (16 lb), Sledgehammer (20 lb)
            - Pry Bar, Wrecking Bar, Flat Bar, Cat's Paw
            - Crowbar, Pinch Bar, Digging Bar
            - Framing Hammer, Claw Hammer, Dead Blow Hammer
            - Nail Puller, Nail Kicker
            - Drywall Pry Bar, Drywall Ripper
            
            POWER TOOLS - CUTTING:
            - Reciprocating Saw (Sawzall), Demo Blades
            - Circular Saw, Carbide Demo Blade
            - Angle Grinder, Cutoff Wheel, Diamond Blade
            - Chainsaw, Electric Chainsaw
            - Oscillating Multi-Tool
            - Jigsaw
            
            POWER TOOLS - DRILLING & BREAKING:
            - Rotary Hammer Drill, SDS-Plus Bits
            - Hammer Drill, Masonry Bits
            - Electric Demolition Hammer (Jack Hammer)
            - Pneumatic Jackhammer
            - Concrete Breaker
            - Chipping Hammer
            
            HEAVY EQUIPMENT:
            - Skid Steer Loader (Bobcat)
            - Mini Excavator
            - Backhoe
            - Dump Trailer
            - Flatbed Trailer
            - Grapple Attachment
            - Bucket Attachment
            
            HAULING & TRANSPORT:
            - Dump Truck, 14-yard Dump Truck
            - Box Truck
            - Pickup Truck with Trailer
            - Utility Trailer
            - Roll-Off Dumpster (10 yd, 20 yd, 30 yd)
            - Wheelbarrow, Heavy-Duty Wheelbarrow
            - Gorilla Cart, Yard Cart
            - Hand Truck, Appliance Dolly
            
            LIFTING & RIGGING:
            - Come-Along (Hand Winch)
            - Chain Hoist, Manual Chain Block
            - Tow Strap, Recovery Strap
            - Ratchet Straps, Tie-Down Straps
            - Chain and Binders
            - Lifting Slings
            - Pallet Jack
            
            SAFETY EQUIPMENT:
            - Hard Hat, Bump Cap
            - Safety Glasses, Goggles
            - Face Shield
            - N95 Respirator, Half-Face Respirator, Full-Face Respirator
            - Hearing Protection, Ear Muffs, Ear Plugs
            - Work Gloves, Cut-Resistant Gloves, Leather Gloves
            - Steel-Toe Boots, Composite-Toe Boots
            - Hi-Vis Vest, Safety Vest
            - Knee Pads
            - Fall Protection Harness, Lanyard
            - First Aid Kit
            
            SITE PROTECTION:
            - Plastic Sheeting, Poly Sheeting
            - Drop Cloths, Canvas Tarps
            - Dust Barriers, Zip Walls
            - Caution Tape, Barrier Tape
            - Traffic Cones, Safety Cones
            - Barricades
            - Plywood Sheets (floor protection)
            
            SPECIALTY TOOLS:
            - Bolt Cutters, Cable Cutters
            - Pipe Wrench, Adjustable Wrench
            - Socket Set, Impact Wrench
            - Staple Puller, Staple Remover
            - Floor Scraper, Long-Handle Scraper
            - Tile Chisel, Cold Chisel
            - Wire Brush, Grinder Wire Wheel
            - Extension Cords, Heavy-Duty Extension Cords
            - Generator, Portable Generator
            - Work Lights, LED Work Lights
            - Ladder (Step Ladder, Extension Ladder)
            - Scaffolding
            
            IMPORTANT: Use specific structure names and equipment names from vocabulary above. Estimate dimensions carefully. Note materials and conditions accurately.
            Total = Sum of all structure costs + material surcharges + extra disposal if needed.`,
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
