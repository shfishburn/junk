import { CityLandingPage, CityData } from "@/components/CityLandingPage";

const laConnerData: CityData = {
  name: "La Conner",
  slug: "la-conner",
  county: "Skagit County",
  tagline: "Junk Removal for Skagit Valley's Artistic Waterfront Gem",
  description: "La Conner's charming waterfront village and artistic community deserves junk removal that respects its unique character. Whether you're clearing out a gallery space on First Street, renovating a historic home, or cleaning up after a seasonal event, Junky Gurus handles it all with care. We love La Conner — and we love keeping it beautiful.",
  neighborhoods: [
    "Downtown La Conner",
    "First Street Waterfront",
    "Maple Avenue",
    "Swinomish Channel Area",
    "North La Conner",
    "South Hill",
  ],
  landmarks: [
    "Museum of Northwest Art",
    "Swinomish Channel",
    "La Conner Waterfront",
    "Rainbow Bridge",
    "Tillinghast Seed Company",
    "La Conner Marina",
    "Skagit County Historical Museum",
  ],
  localContext: "La Conner's mix of art galleries, boutiques, and historic homes means junk removal needs vary widely. We've helped artists clear studios, homeowners renovate cottages, and businesses prepare for the tulip festival rush. Our smaller trucks can navigate the tight streets and alleys that make La Conner so charming.",
  coordinates: { lat: 48.3921, lng: -122.4962 },
};

export default function LaConner() {
  return <CityLandingPage city={laConnerData} />;
}
