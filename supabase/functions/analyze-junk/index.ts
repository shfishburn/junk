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
              
              SINGLE ITEM PRICES:
              - Sofa/Couch: $75-150, Large Sectional: $150-250, Loveseat: $60-100
              - Recliner: $50-85, Armchair: $50-85, Office Chair: $25-50
              - Mattress (any size): $50-100, Box Spring: $40-75, Bed Frame: $40-75
              - Dresser/Chest: $50-100, Armoire/Wardrobe: $75-150, Nightstand: $25-50
              - Dining Table: $50-100, Dining Chairs (each): $15-30, Desk: $50-100
              - Bookshelf: $35-75, Entertainment Center: $50-100, TV Stand: $35-65
              - TV: $35-75, CRT TV: $50-85, Computer: $25-50
              - Refrigerator/Freezer: $75-125, Mini Fridge: $35-60
              - Washer or Dryer: $65-100 each, Dishwasher: $50-85
              - Stove/Oven: $65-100, Microwave: $25-45, Water Heater: $75-125
              - Treadmill/Elliptical: $75-125, Exercise Bike: $50-85, Home Gym: $100-175
              - Hot Tub: $300-500, Pool Table: $200-350
              - Piano (upright): $200-350, Piano (grand): $350-500
              - Grill/BBQ: $50-100, Patio Set: $75-150
              - Swing Set: $150-300, Trampoline: $100-200
              - Lawn Mower: $35-60, Riding Mower: $100-175
              - Safe: $100-200, Boxes/Bags: $10-25 each
              
              TRUCK LOAD PRICING:
              - Minimum Load (~5%): $125-190
              - 1/8 Truck (~12.5%): $190-250
              - 1/4 Truck (~25%): $250-375
              - 1/2 Truck (~50%): $375-500
              - 3/4 Truck (~75%): $500-625
              - Full Truck (100%): $625-815
              
              VOLUME GUIDE: Couch: 1-1.5 cy, Mattress: 0.5-0.75 cy, Fridge: 0.75-1 cy
              Full truck = ~15 cubic yards
              
              WEIGHT SURCHARGES (add 10-20%): Concrete, safes, pianos, hot tubs, cast iron
              
              Be accurate and fair - calculate both methods and use the higher price.`,
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
            
            CRITICAL IDENTIFICATION RULES:
            1. BE SPECIFIC - Never use generic terms. Identify exact item types.
            2. DISTINGUISH SEATING CAREFULLY:
               - RECLINER = Single seat with reclining mechanism (footrest pops out, back reclines)
               - RECLINING CHAIR = Same as recliner, single person seat that reclines
               - LOVESEAT = Two-person seat (fits 2 people side by side), may or may not recline
               - RECLINING LOVESEAT = Two-person seat with reclining mechanism on one or both sides
               - SOFA/COUCH = Three+ person seat (fits 3+ people), typically 7+ feet wide
               - RECLINING SOFA = Three+ seat sofa with reclining ends
               - SECTIONAL = L-shaped or larger multi-piece sofa
            3. COUNT SEATS to determine size: 1 seat = chair/recliner, 2 seats = loveseat, 3+ seats = sofa
            4. Look for reclining mechanisms (handles, buttons, footrests) - if present, specify "Reclining"
            5. DO NOT identify clutter, fabric, or background items as "bags" unless they are actual bags
            6. Only identify items that actually need removal - ignore background/context items
            
            ITEM IDENTIFICATION VOCABULARY (use these SPECIFIC names):
            
            FURNITURE - Living Room (SEATING - be precise!):
            - Recliner, Reclining Chair, Rocker Recliner, Wall-Hugger Recliner, Power Recliner, Leather Recliner
            - Loveseat, Reclining Loveseat, Power Reclining Loveseat, Leather Loveseat
            - Sofa, Couch, Reclining Sofa, Power Reclining Sofa, Leather Sofa
            - Sectional Sofa, L-Shaped Sectional, U-Shaped Sectional, Reclining Sectional
            - Sleeper Sofa, Sofa Bed, Pull-Out Couch, Futon
            - Settee, Chaise Lounge, Fainting Couch, Daybed
            - Armchair, Accent Chair, Wing Chair, Club Chair, Swivel Chair
            - Papasan Chair, Egg Chair, Hanging Chair, Bean Bag Chair
            - Glider, Rocker, Rocking Chair, Nursing Chair
            
            FURNITURE - Living Room (OTHER):
            - Ottoman, Footstool, Pouf, Storage Ottoman, Recliner Footrest
            - Coffee Table, End Table, Side Table, Accent Table, Console Table, Sofa Table
            - TV Stand, Entertainment Center, Media Console, TV Cabinet, AV Stand
            - Bookshelf, Bookcase, Display Cabinet, Curio Cabinet, China Cabinet
            - Floor Lamp, Table Lamp, Lamp (any), Chandelier
            
            FURNITURE - Bedroom:
            - Mattress (Twin), Mattress (Full/Double), Mattress (Queen), Mattress (King), Mattress (California King)
            - Box Spring (any size), Foundation, Adjustable Bed Base, Bed Frame, Platform Bed
            - Headboard, Footboard, Bed Rails, Bunk Bed, Loft Bed, Trundle Bed, Murphy Bed
            - Dresser, Tall Dresser, Double Dresser, Chest of Drawers, Highboy, Lowboy
            - Nightstand, Bedside Table, Night Table
            - Armoire, Wardrobe, Clothing Armoire, TV Armoire
            - Vanity, Vanity Table, Makeup Vanity, Dresser Mirror, Standing Mirror, Full-Length Mirror
            
            FURNITURE - Dining/Kitchen:
            - Dining Table, Kitchen Table, Breakfast Table, Drop-Leaf Table, Extendable Table
            - Dining Chair, Kitchen Chair, Bar Stool, Counter Stool, High Chair, Booster Seat
            - Buffet, Sideboard, Hutch, China Hutch, Baker's Rack, Kitchen Island, Kitchen Cart
            
            FURNITURE - Office:
            - Desk, Computer Desk, Executive Desk, L-Shaped Desk, Standing Desk, Writing Desk, Secretary Desk
            - Office Chair, Executive Chair, Task Chair, Ergonomic Chair, Mesh Chair, Gaming Chair
            - Filing Cabinet (2-drawer), Filing Cabinet (4-drawer), Lateral File Cabinet
            - Bookcase, Office Bookshelf, Credenza, Office Storage Cabinet
            
            APPLIANCES - Kitchen:
            - Refrigerator, Side-by-Side Refrigerator, French Door Refrigerator, Top Freezer Refrigerator
            - Mini Fridge, Compact Refrigerator, Wine Cooler, Beverage Cooler, Kegerator
            - Freezer, Chest Freezer, Upright Freezer, Deep Freezer
            - Stove, Gas Stove, Electric Stove, Range, Oven, Wall Oven, Double Oven
            - Microwave, Over-the-Range Microwave, Countertop Microwave, Microwave Cart
            - Dishwasher, Portable Dishwasher
            - Trash Compactor, Garbage Disposal Unit
            - Range Hood, Vent Hood, Exhaust Fan
            
            APPLIANCES - Laundry:
            - Washer, Washing Machine, Top-Load Washer, Front-Load Washer
            - Dryer, Gas Dryer, Electric Dryer, Stacked Washer/Dryer, Combo Washer/Dryer
            - Laundry Sink, Utility Sink
            
            APPLIANCES - Climate:
            - Window AC, Window Air Conditioner, Portable AC, Mini Split Unit
            - Space Heater, Portable Heater, Radiator, Baseboard Heater
            - Dehumidifier, Humidifier, Air Purifier, Swamp Cooler, Evaporative Cooler
            - Water Heater, Hot Water Tank, Tankless Water Heater
            - Furnace, Boiler
            
            APPLIANCES - Other:
            - Vacuum Cleaner, Shop Vac, Central Vacuum
            - Sewing Machine, Sewing Table
            
            ELECTRONICS:
            - TV, Television, Flat Screen TV, CRT TV, Tube TV, Projection TV, Plasma TV
            - Computer Monitor, CRT Monitor, LCD Monitor
            - Desktop Computer, Computer Tower, PC, Server, Computer Case
            - Laptop, Notebook Computer
            - Printer, Copier, Fax Machine, All-in-One Printer, Large Format Printer
            - Stereo System, Home Theater System, Receiver, Amplifier, Subwoofer
            - Speakers, Floor Speakers, Bookshelf Speakers, Surround Sound Speakers
            - VCR, DVD Player, Blu-Ray Player, Cable Box, Satellite Receiver, TiVo
            - Gaming Console, PlayStation, Xbox, Nintendo, Wii
            - Treadmill, Elliptical, Exercise Bike, Stationary Bike, Spin Bike
            - Rowing Machine, Stair Climber, Home Gym, Weight Machine, Smith Machine
            - Record Player, Turntable, Stereo Cabinet
            
            OUTDOOR/GARAGE:
            - Lawn Mower, Push Mower, Riding Mower, Zero-Turn Mower
            - Weed Whacker, String Trimmer, Leaf Blower, Chainsaw, Hedge Trimmer
            - Snow Blower, Snowplow
            - Wheelbarrow, Garden Cart, Yard Cart
            - Grill, Gas Grill, Charcoal Grill, Smoker, BBQ, Propane Tank
            - Patio Umbrella, Patio Heater, Fire Pit, Outdoor Fireplace
            - Patio Table, Patio Chair, Patio Set, Outdoor Sofa, Outdoor Loveseat
            - Adirondack Chair, Lounge Chair, Chaise, Pool Lounger
            - Picnic Table, Park Bench, Garden Bench
            - Hammock, Hammock Stand, Porch Swing, Glider
            - Shed (Small), Shed (Medium), Shed (Large), Storage Shed
            - Playhouse, Treehouse, Clubhouse
            - Swing Set, Playset, Jungle Gym, Slide, Sandbox
            - Trampoline, Basketball Hoop, Portable Basketball Hoop
            - Hot Tub, Spa, Jacuzzi, Above Ground Pool, Pool Ladder, Pool Pump
            - Fence Section, Gate, Arbor, Trellis
            - Planter Box, Large Planter, Garden Bed Frame
            - Ladder, Extension Ladder, Step Ladder, Scaffolding
            - Tool Box, Tool Chest, Tool Cabinet, Workbench
            - Compressor, Air Compressor, Shop Tools
            - Sawhorses, Work Table
            
            SPORTS & RECREATION:
            - Bicycle, Bike, Mountain Bike, Road Bike, Kids Bike, Tricycle
            - Exercise Equipment, Weights, Dumbbells, Weight Bench, Squat Rack
            - Golf Clubs, Golf Bag, Ski Equipment, Snowboard, Surfboard
            - Kayak, Canoe, Paddleboard
            - Camping Gear, Tent, Camping Stove
            - Pool Table, Billiard Table, Foosball Table, Air Hockey Table, Ping Pong Table
            - Dart Board, Arcade Machine, Pinball Machine
            
            BABY/KIDS:
            - Crib, Baby Crib, Convertible Crib, Bassinet, Cradle
            - Changing Table, Diaper Changing Station
            - High Chair, Booster Seat, Infant Car Seat, Stroller, Double Stroller
            - Pack and Play, Playpen, Baby Gate
            - Toddler Bed, Kids Bed, Kids Desk, Kids Chair
            - Toy Box, Toy Chest, Toy Organizer
            - Toys (box/bag), Stuffed Animals (bag), Kids Books (box)
            
            MUSICAL INSTRUMENTS:
            - Piano (Upright), Piano (Grand), Piano (Baby Grand), Piano (Digital/Electric)
            - Keyboard, Synthesizer, Organ, Electric Organ
            - Guitar, Acoustic Guitar, Electric Guitar, Bass Guitar, Guitar Amplifier
            - Drum Set, Drum Kit, Electronic Drums
            - Other Instruments
            
            MISCELLANEOUS ITEMS:
            - Boxes (Small), Boxes (Medium), Boxes (Large), Moving Boxes
            - Bags, Trash Bags (full), Garbage Bags
            - Totes, Plastic Bins, Storage Bins, Rubbermaid Totes
            - Luggage, Suitcase, Trunk
            - Carpet, Area Rug, Rolled Carpet, Carpet Padding
            - Blinds, Curtains, Drapes, Curtain Rod
            - Clothing (bag), Shoes (box), Linens (bag), Blankets, Pillows
            - Books (box), Magazines (box), Papers (box), Documents
            - Dishes (box), Kitchenware (box), Pots and Pans, Small Appliances
            - Holiday Decorations (box), Christmas Tree, Artificial Christmas Tree
            - Picture Frames, Artwork, Canvas, Paintings
            - Safe, Gun Safe, Fireproof Safe
            - Aquarium, Fish Tank, Terrarium
            - Fireplace Insert, Wood Stove, Pellet Stove
            - Mannequin, Display Case, Retail Fixtures
            - Medical Equipment, Wheelchair, Walker, Hospital Bed, Mobility Scooter
            - Exercise Mat, Yoga Mat, Foam Roller
            - Tire, Tires (set of 4), Car Parts, Engine, Transmission
            - Batteries, Car Battery, Lead Acid Battery
            - Paint Cans, Chemicals (must note for hazmat)
            - Debris, Construction Debris, Renovation Debris, Rubble
            - Scrap Metal, Scrap Wood, Lumber, Pallets
            - Old Fencing, Fence Posts, Chain Link Fencing
            - Doors, Windows, Shutters, Screen Door, Storm Door
            - Countertop, Cabinet Doors, Kitchen Cabinets
            - Toilet, Sink, Bathroom Vanity, Bathtub, Shower Door
            - Water Softener, Water Filtration System
            - Random Junk Pile, Miscellaneous Items, Clutter
            
            PRICING STRATEGY:
            1. For 1-3 single items: Use SINGLE ITEM pricing (sum individual items)
            2. For 4+ items or large volumes: Use TRUCK LOAD pricing based on total volume
            3. Always use whichever method gives the HIGHER price (minimum viable rate)
            
            SINGLE ITEM PRICES (memorize these - use SPECIFIC item names):
            - Recliner: $50-85, Reclining Chair: $50-85, Power Recliner: $65-100
            - Loveseat: $60-100, Reclining Loveseat: $75-125
            - Sofa/Couch: $75-150, Reclining Sofa: $100-175
            - Large Sectional: $150-250, Reclining Sectional: $175-275
            - Armchair/Accent Chair: $40-75
            - Sleeper Sofa: $100-175, Futon: $50-85
            - Mattress (any size): $50-100, Box Spring: $40-75
            - Bed Frame: $40-75, Bunk Bed: $100-175
            - Dresser/Chest: $50-100, Armoire/Wardrobe: $75-150
            - Nightstand: $25-50, Desk: $50-100
            - Dining Table: $50-100, Dining Chairs (each): $15-30
            - Office Chair: $25-50, Bookshelf: $35-75
            - Entertainment Center: $50-100, TV Stand: $35-65
            - TV (any size): $35-75, CRT TV: $50-85
            - Refrigerator/Freezer: $75-125, Mini Fridge: $35-60
            - Washer or Dryer (each): $65-100
            - Dishwasher: $50-85, Stove/Oven: $65-100
            - Microwave: $25-45, Window AC: $35-60
            - Water Heater: $75-125
            - Treadmill/Elliptical: $75-125, Exercise Bike: $50-85
            - Weight Bench/Home Gym: $75-150
            - Hot Tub: $300-500
            - Piano (upright): $200-350, Piano (grand): $350-500
            - Pool Table: $200-350
            - Grill/BBQ: $50-100
            - Patio Furniture Set: $75-150
            - Swing Set/Playset: $150-300
            - Trampoline: $100-200
            - Shed (small): $200-400
            - Lawn Mower (push): $35-60, Riding Mower: $100-175
            - Boxes/Bags (each): $10-25 (only if ACTUAL bags/boxes, not clutter)
            - Safe/Gun Safe: $100-200
            - Wheelchair/Medical Equipment: $50-100
            
            TRUCK LOAD PRICING (for larger jobs):
            - Minimum Load (~5%, 1-2 small items): $125-190
            - 1/8 Truck (~12.5%): $190-250
            - 1/4 Truck (~25%): $250-375
            - 1/2 Truck (~50%): $375-500
            - 3/4 Truck (~75%): $500-625
            - Full Truck (100%): $625-815
            
            VOLUME REFERENCE (cubic yards):
            - Sofa: 1-1.5 cy, Reclining Sofa: 1.25-1.75 cy
            - Loveseat: 0.75 cy, Reclining Loveseat: 0.85 cy
            - Recliner: 0.5-0.6 cy
            - Mattress: 0.5-0.75 cy, Dresser: 0.5-0.75 cy
            - Refrigerator: 0.75-1 cy, Washer/Dryer: 0.5-0.75 cy each
            - Full truck capacity = ~15 cubic yards
            
            WEIGHT SURCHARGES (add 10-20% for):
            - Concrete/brick, safes, pianos, hot tubs, cast iron, heavy appliances
            
            CRITICAL REMINDERS:
            - Use SPECIFIC names: "Reclining Loveseat" not "Sofa", "Recliner" not "Chair"
            - Count seats: 1=recliner/chair, 2=loveseat, 3+=sofa
            - Only identify actual items for removal, not background items
            - "Bags" = actual garbage bags or storage bags, not random clutter`,
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
