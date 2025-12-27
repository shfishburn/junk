import { CityLandingPage, CityData } from "@/components/CityLandingPage";

const marysvilleData: CityData = {
  name: "Marysville",
  slug: "marysville",
  county: "Snohomish County",
  tagline: "Fast, Friendly Junk Removal for the Strawberry City",
  description: "Marysville has grown from its strawberry farming roots into a thriving community — and Junky Gurus has grown with it. From the established neighborhoods near downtown to the newer developments in the north, we provide reliable junk removal that fits your schedule and budget. Same-day service available.",
  neighborhoods: [
    "Downtown Marysville",
    "Grove Street Area",
    "Smokey Point",
    "Lakewood",
    "Sunnyside",
    "Pinewood",
    "Kellogg Marsh",
    "Quilceda Village",
  ],
  landmarks: [
    "Marysville Opera House",
    "Jennings Park",
    "Quilceda Creek Casino",
    "Seattle Premium Outlets",
    "Ebey Waterfront Trail",
    "Comeford Park",
    "Marysville Strawberry Festival",
  ],
  localContext: "Marysville's rapid growth means plenty of renovation projects, move-outs, and cleanups. We've partnered with real estate agents, property managers, and homeowners throughout the city to provide dependable junk removal. Whether it's a single couch or a whole house cleanout, we handle it all.",
  coordinates: { lat: 48.0518, lng: -122.1770 },
};

export default function Marysville() {
  return <CityLandingPage city={marysvilleData} />;
}
