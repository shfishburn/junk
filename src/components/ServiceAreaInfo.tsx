import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib";

export const SERVICE_AREA_DATA = {
  baseLocation: "Mount Vernon, WA",
  radius: "50 miles",
  counties: [
    {
      name: "Skagit County",
      citiesSummary: "Mount Vernon, Burlington, Anacortes, Sedro-Woolley",
      cities: ["Mount Vernon", "Burlington", "Anacortes", "Sedro-Woolley", "La Conner", "Concrete", "Bow", "Edison"],
      description: "Our home turf! We know every back road, coffee shop, and suspiciously full garage in Skagit County.",
      isHomeBase: true,
    },
    {
      name: "Whatcom County",
      citiesSummary: "Bellingham, Lynden, Ferndale, Blaine",
      cities: ["Bellingham", "Lynden", "Ferndale", "Blaine", "Everson", "Sumas", "Nooksack", "Birch Bay"],
      description: "From Bellingham's hip neighborhoods to the Canadian border, we've got your junk covered.",
      isHomeBase: false,
    },
    {
      name: "Snohomish County",
      citiesSummary: "Everett, Marysville, Lake Stevens, Arlington",
      cities: ["Everett", "Marysville", "Lake Stevens", "Arlington", "Stanwood", "Granite Falls", "Snohomish", "Tulalip"],
      description: "We serve northern Snohomish County with the same enthusiasm we bring everywhere.",
      isHomeBase: false,
    },
    {
      name: "King County",
      citiesSummary: "North Seattle, Shoreline, Kenmore, Bothell",
      cities: ["Shoreline", "Kenmore", "Bothell", "Woodinville", "North Seattle", "Lake Forest Park", "Mountlake Terrace", "Edmonds"],
      description: "We venture into northern King County for bigger projects.",
      isHomeBase: false,
    },
  ],
  cityLinks: {
    "Mount Vernon": "/junk-removal-mount-vernon-wa",
    "Burlington": "/junk-removal-burlington-wa",
    "Anacortes": "/junk-removal-anacortes-wa",
    "Sedro-Woolley": "/junk-removal-sedro-woolley-wa",
    "La Conner": "/junk-removal-la-conner-wa",
    "Concrete": "/junk-removal-concrete-wa",
    "Bow": "/junk-removal-bow-wa",
    "Bellingham": "/junk-removal-bellingham-wa",
    "Marysville": "/junk-removal-marysville-wa",
    "Stanwood": "/junk-removal-stanwood-wa",
  } as Record<string, string>,
};

interface ServiceAreaInfoProps {
  variant?: "summary" | "badges" | "inline";
  showIcon?: boolean;
  className?: string;
}

export function ServiceAreaInfo({
  variant = "summary",
  showIcon = true,
  className,
}: ServiceAreaInfoProps) {
  if (variant === "inline") {
    return (
      <span className={className}>
        Serving {SERVICE_AREA_DATA.counties.map(c => c.name).join(", ")}
      </span>
    );
  }

  if (variant === "badges") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {SERVICE_AREA_DATA.counties.map((county) => (
          <span
            key={county.name}
            className={cn(
              "px-3 py-1 text-sm rounded-full",
              county.isHomeBase
                ? "bg-primary/10 border border-primary/30 text-primary"
                : "bg-background border border-border text-muted-foreground"
            )}
          >
            {county.name}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {SERVICE_AREA_DATA.counties.map((county) => (
        <div key={county.name} className="flex items-start gap-2">
          {showIcon && (
            <MapPin className={cn(
              "h-4 w-4 flex-shrink-0 mt-0.5",
              county.isHomeBase ? "text-primary" : "text-muted-foreground"
            )} />
          )}
          <div>
            <span className={cn(
              "font-medium",
              county.isHomeBase ? "text-primary" : "text-foreground"
            )}>
              {county.name}
            </span>
            <span className="text-muted-foreground text-sm ml-1">
              — {county.citiesSummary}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

interface CountyCardProps {
  county: typeof SERVICE_AREA_DATA.counties[0];
  className?: string;
}

export function CountyCard({ county, className }: CountyCardProps) {
  return (
    <div
      className={cn(
        "p-8 rounded-lg border",
        county.isHomeBase
          ? "border-primary/30 bg-primary/5"
          : "border-border bg-card",
        className
      )}
    >
      <div className="flex items-start gap-3 mb-4">
        <MapPin className={cn("h-6 w-6 mt-1", county.isHomeBase ? "text-primary" : "text-muted-foreground")} />
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-charcoal">
            {county.name}
            {county.isHomeBase && (
              <span className="ml-3 text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                Home Base
              </span>
            )}
          </h2>
          <p className="text-lg text-muted-foreground mt-2">
            {county.description}
          </p>
        </div>
      </div>
      <div className="ml-9">
        <h3 className="font-semibold text-charcoal mb-3">Cities We Serve:</h3>
        <div className="flex flex-wrap gap-2">
          {county.cities.map((city) => {
            const cityUrl = SERVICE_AREA_DATA.cityLinks[city];
            return cityUrl ? (
              <Link
                key={city}
                to={cityUrl}
                className="px-3 py-1 text-sm bg-primary/10 border border-primary/30 rounded-full text-primary hover:bg-primary/20 transition-colors"
              >
                {city} →
              </Link>
            ) : (
              <span
                key={city}
                className="px-3 py-1 text-sm bg-background border border-border rounded-full text-muted-foreground"
              >
                {city}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
