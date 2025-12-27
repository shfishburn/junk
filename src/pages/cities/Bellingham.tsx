import { CityLandingPage, CityData } from "@/components/CityLandingPage";

const bellinghamData: CityData = {
  name: "Bellingham",
  slug: "bellingham",
  county: "Whatcom County",
  tagline: "Eco-Conscious Junk Removal for Bellingham's Eco-Conscious Community",
  description: "Bellingham residents care about the environment — and so do we. Junky Gurus prioritizes donation and recycling for every load we haul. From Fairhaven to Barkley, downtown to the university district, we're the junk removal service that aligns with Bellingham values.",
  neighborhoods: [
    "Downtown Bellingham",
    "Fairhaven",
    "Sehome",
    "Barkley",
    "Columbia",
    "Lettered Streets",
    "Happy Valley",
    "South Hill",
    "Birchwood",
    "Cordata",
    "Roosevelt",
    "York",
  ],
  landmarks: [
    "Western Washington University",
    "Whatcom Falls Park",
    "Boulevard Park",
    "Bellingham Bay",
    "Fairhaven Village",
    "Downtown Arts District",
    "Bellingham Cruise Terminal",
    "Mount Baker Theatre",
  ],
  localContext: "Bellingham is known for its outdoor culture, vibrant arts scene, and environmental consciousness. When you choose Junky Gurus, you're choosing a service that shares those values. We donate usable items to local charities, recycle what we can, and only landfill what's truly beyond saving.",
  coordinates: { lat: 48.7519, lng: -122.4787 },
};

export default function Bellingham() {
  return <CityLandingPage city={bellinghamData} />;
}
