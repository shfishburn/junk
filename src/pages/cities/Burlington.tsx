import { CityLandingPage, CityData } from "@/components/CityLandingPage";

const burlingtonData: CityData = {
  name: "Burlington",
  slug: "burlington",
  county: "Skagit County",
  tagline: "Your Trusted Junk Removal Partner in the Heart of Skagit Valley",
  description: "Burlington is growing fast, and so is the need for reliable junk removal. Whether you're clearing out after a home renovation near Cascade Mall or cleaning up a garage in downtown Burlington, Junky Gurus is here to help. We know the area, we know the community, and we know how to make your junk disappear.",
  neighborhoods: [
    "Downtown Burlington",
    "Gages Slough",
    "Burlington Boulevard",
    "Fairhaven Avenue Area",
    "Cascade Mall District",
    "West Burlington",
    "Rio Vista",
    "Skagit Regional Airport Area",
  ],
  landmarks: [
    "Cascade Mall",
    "Skagit Valley College",
    "Burlington-Edison School District",
    "Skagit Regional Airport",
    "Burlington Northern Railroad",
    "Skagit River",
  ],
  localContext: "From the bustling Cascade Mall area to the quiet residential streets near Skagit Valley College, we've been serving Burlington families and businesses for years. We understand the unique needs of our community — from helping new homeowners settle in to clearing out storage units before the next adventure.",
  coordinates: { lat: 48.4754, lng: -122.3254 },
};

export default function Burlington() {
  return <CityLandingPage city={burlingtonData} />;
}
