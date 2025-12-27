import { CityLandingPage, CityData } from "@/components/CityLandingPage";

const bowData: CityData = {
  name: "Bow",
  slug: "bow",
  county: "Skagit County",
  tagline: "Rural Junk Removal Done Right in Edison Country",
  description: "Bow and the surrounding Edison area blend rural charm with creative energy. From farmstead cleanouts to studio space clearing, Junky Gurus brings reliable junk removal to this beautiful corner of Skagit County. We know the back roads, we respect the land, and we haul away whatever's weighing you down.",
  neighborhoods: [
    "Bow Hill",
    "Edison",
    "Samish Island",
    "Bow-Edison Road Corridor",
    "Allen West Road Area",
    "Farm to Market Road",
  ],
  landmarks: [
    "Breadfarm Bakery",
    "Edison Community",
    "Samish Bay",
    "Bow Cemetery",
    "Chuckanut Drive",
    "Taylor Shellfish Farms",
    "Samish Island",
  ],
  localContext: "The Bow-Edison community values sustainability and creativity. We get it. That's why we prioritize donation and recycling for every load. Whether you're clearing out a barn, refreshing a vacation rental, or cleaning up after a Samish Island project, we bring the same eco-conscious approach to every job.",
  coordinates: { lat: 48.5612, lng: -122.4334 },
};

export default function Bow() {
  return <CityLandingPage city={bowData} />;
}
