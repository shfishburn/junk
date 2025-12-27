import { CityLandingPage, CityData } from "@/components/CityLandingPage";

const sedroWoolleyData: CityData = {
  name: "Sedro-Woolley",
  slug: "sedro-woolley",
  county: "Skagit County",
  tagline: "Gateway to the Cascades, Gateway to a Clutter-Free Home",
  description: "Sedro-Woolley is the gateway to the North Cascades — and Junky Gurus is your gateway to a cleaner, more organized space. Whether you're clearing out a barn, renovating an older home, or just finally tackling that garage project, we've got the truck and the muscle to make it happen.",
  neighborhoods: [
    "Downtown Sedro-Woolley",
    "Cascade Middle School Area",
    "North Sedro-Woolley",
    "South Sedro-Woolley",
    "Sterling Area",
    "Fruitdale",
    "Big Lake Road Area",
    "Highway 20 Corridor",
  ],
  landmarks: [
    "North Cascades Gateway Center",
    "Sedro-Woolley Museum",
    "Northern State Recreation Area",
    "Cascade Trail",
    "Janicki Industries",
    "Skagit County Fairgrounds (nearby)",
  ],
  localContext: "Sedro-Woolley has a proud history and a community that values hard work. We fit right in. From helping long-time residents clear out decades of memories to supporting new families moving into town, we treat every job with the care and respect it deserves.",
  coordinates: { lat: 48.5034, lng: -122.2357 },
};

export default function SedroWoolley() {
  return <CityLandingPage city={sedroWoolleyData} />;
}
