import { cn } from "@/lib/utils";

const loadLevels = [
  { fraction: "1/4", fillPercent: 25, price: "$200 – $300", description: "Small room cleanout" },
  { fraction: "1/2", fillPercent: 50, price: "$300 – $400", description: "Garage cleanout" },
  { fraction: "3/4", fillPercent: 75, price: "$400 – $500", description: "Multiple rooms" },
  { fraction: "Full", fillPercent: 100, price: "$500 – $650", description: "Estate cleanout" },
];

export const TruckLoadDiagram = () => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-charcoal mb-2">Visualize Your Load</h3>
        <p className="text-sm text-muted-foreground">Our truck bed is 12' × 8' — here's what different loads look like</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {loadLevels.map((level) => (
          <div key={level.fraction} className="flex flex-col items-center gap-3">
            {/* Truck bed visualization */}
            <div className="relative w-full aspect-[3/2] max-w-[180px]">
              {/* Truck bed container */}
              <div className="absolute inset-0 rounded-lg border-2 border-charcoal/30 bg-muted/30 overflow-hidden">
                {/* Grid lines for depth effect */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/4 left-0 right-0 border-t border-dashed border-charcoal/50" />
                  <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-charcoal/50" />
                  <div className="absolute top-3/4 left-0 right-0 border-t border-dashed border-charcoal/50" />
                </div>
                
                {/* Fill representing junk */}
                <div 
                  className={cn(
                    "absolute bottom-0 left-0 right-0 transition-all duration-500",
                    "bg-gradient-to-t from-primary via-primary/80 to-primary/60"
                  )}
                  style={{ height: `${level.fillPercent}%` }}
                >
                  {/* Junk items illustration */}
                  <div className="absolute inset-0 overflow-hidden opacity-40">
                    {level.fillPercent >= 25 && (
                      <>
                        <div className="absolute bottom-1 left-1 w-4 h-3 bg-primary-foreground/30 rounded-sm" />
                        <div className="absolute bottom-1 right-2 w-5 h-4 bg-primary-foreground/30 rounded-sm" />
                      </>
                    )}
                    {level.fillPercent >= 50 && (
                      <>
                        <div className="absolute bottom-5 left-3 w-6 h-3 bg-primary-foreground/30 rounded-sm" />
                        <div className="absolute bottom-4 right-1 w-4 h-5 bg-primary-foreground/30 rounded-sm" />
                      </>
                    )}
                    {level.fillPercent >= 75 && (
                      <>
                        <div className="absolute bottom-9 left-1 w-5 h-4 bg-primary-foreground/30 rounded-sm" />
                        <div className="absolute bottom-10 right-3 w-4 h-3 bg-primary-foreground/30 rounded-sm" />
                      </>
                    )}
                    {level.fillPercent >= 100 && (
                      <>
                        <div className="absolute top-1 left-2 w-5 h-3 bg-primary-foreground/30 rounded-sm" />
                        <div className="absolute top-2 right-1 w-4 h-4 bg-primary-foreground/30 rounded-sm" />
                      </>
                    )}
                  </div>
                </div>
                
                {/* Percentage marker */}
                <div 
                  className="absolute right-1 text-xs font-bold text-primary transition-all duration-500"
                  style={{ bottom: `${Math.max(level.fillPercent - 8, 2)}%` }}
                >
                  {level.fillPercent}%
                </div>
              </div>
              
              {/* Truck cab silhouette */}
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-8 bg-charcoal/20 rounded-l-md" />
              
              {/* Wheels */}
              <div className="absolute -bottom-2 left-2 w-4 h-4 bg-charcoal/40 rounded-full" />
              <div className="absolute -bottom-2 right-2 w-4 h-4 bg-charcoal/40 rounded-full" />
            </div>
            
            {/* Labels */}
            <div className="text-center">
              <span className="block text-lg font-bold text-charcoal">{level.fraction} Load</span>
              <span className="block text-sm font-semibold text-primary">{level.price}</span>
              <span className="block text-xs text-muted-foreground">{level.description}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Truck bed dimensions note */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Truck bed dimensions: 12 ft long × 8 ft wide × 4 ft high
        </div>
      </div>
    </div>
  );
};
