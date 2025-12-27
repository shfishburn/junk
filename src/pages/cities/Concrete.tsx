import { CityLandingPage, CityData } from "@/components/CityLandingPage";

const concreteData: CityData = {
  name: "Concrete",
  slug: "concrete",
  county: "Skagit County",
  tagline: "Serving the Upper Skagit Valley with Reliable Junk Removal",
  description: "Concrete and the Upper Skagit Valley may be off the beaten path, but you still deserve top-notch junk removal. Junky Gurus travels up Highway 20 to serve this historic mountain town and surrounding communities. From cabin cleanouts to construction debris, we handle the haul so you can enjoy the views.",
  neighborhoods: [
    "Downtown Concrete",
    "Grasmere",
    "Cape Horn",
    "Birdsview",
    "Rockport",
    "Marblemount",
    "Baker Lake Area",
  ],
  landmarks: [
    "Concrete Theatre",
    "Henry Thompson Bridge",
    "Baker Lake",
    "Skagit River",
    "North Cascades Highway",
    "Concrete Heritage Museum",
    "Baker Lake Dam",
  ],
  localContext: "Upper Skagit living means dealing with unique challenges — remote properties, seasonal access, and mountain weather. We're equipped to handle it all. Many of our customers are vacation property owners, retirees, or outdoor enthusiasts who need reliable junk removal without the hassle of hauling it themselves.",
  coordinates: { lat: 48.5390, lng: -121.7515 },
};

export default function Concrete() {
  return <CityLandingPage city={concreteData} />;
}
