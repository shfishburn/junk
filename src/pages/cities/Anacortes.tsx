import { CityLandingPage, CityData } from "@/components/CityLandingPage";

const anacortesData: CityData = {
  name: "Anacortes",
  slug: "anacortes",
  county: "Skagit County",
  tagline: "Island Living Deserves Island-Quality Junk Removal",
  description: "Anacortes may be a gateway to the San Juan Islands, but you don't need to ferry your junk anywhere. Junky Gurus comes to you — whether you're in the historic downtown, near the ferry terminal, or tucked away in a waterfront neighborhood. We handle everything from boat gear to basement cleanouts.",
  neighborhoods: [
    "Downtown Anacortes",
    "Cap Sante",
    "Washington Park Area",
    "Skyline",
    "Fidalgo Bay",
    "Ship Harbor",
    "Heart Lake Area",
    "March Point",
  ],
  landmarks: [
    "Washington State Ferries Terminal",
    "Washington Park",
    "Cap Sante Park",
    "Anacortes Marina",
    "Fidalgo Island",
    "Mount Erie",
    "Deception Pass (nearby)",
  ],
  localContext: "Living on Fidalgo Island comes with unique challenges — especially when it comes to getting rid of old furniture, appliances, or accumulated stuff. We serve all of Anacortes, from the charming downtown shops to the scenic bluffs of Cap Sante. No ferry required for us — just a phone call.",
  coordinates: { lat: 48.5126, lng: -122.6127 },
};

export default function Anacortes() {
  return <CityLandingPage city={anacortesData} />;
}
