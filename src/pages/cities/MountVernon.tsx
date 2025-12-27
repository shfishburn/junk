import { CityLandingPage, CityData } from "@/components/CityLandingPage";

const mountVernonData: CityData = {
  name: "Mount Vernon",
  slug: "mount-vernon",
  county: "Skagit County",
  tagline: "The County Seat's Go-To Junk Removal Experts",
  description: "As the heart of Skagit County, Mount Vernon deserves junk removal that matches its vibrant community spirit. From the historic downtown district to the neighborhoods along the Skagit River, Junky Gurus provides fast, reliable, and eco-friendly junk removal. We're proud to serve the county seat with the same dedication we bring to every job.",
  neighborhoods: [
    "Downtown Mount Vernon",
    "Hillcrest",
    "College Way Corridor",
    "Riverside",
    "West Mount Vernon",
    "Kincaid Street Area",
    "Anderson Road Corridor",
    "Division Street District",
  ],
  landmarks: [
    "Lincoln Theatre",
    "Skagit Valley Hospital",
    "Skagit Valley Tulip Fields",
    "Edgewater Park",
    "Skagit County Courthouse",
    "Mount Vernon High School",
    "Skagit River",
    "Heritage Flight Museum",
  ],
  localContext: "From helping families near the tulip fields prepare for spring to clearing out basements in the historic downtown area, we've built relationships throughout Mount Vernon. We understand the mix of historic homes and new developments that make this city unique — and we handle junk from all of them.",
  coordinates: { lat: 48.4213, lng: -122.3341 },
};

export default function MountVernon() {
  return <CityLandingPage city={mountVernonData} />;
}
