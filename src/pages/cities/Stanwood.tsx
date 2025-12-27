import { CityLandingPage, CityData } from "@/components/CityLandingPage";

const stanwoodData: CityData = {
  name: "Stanwood",
  slug: "stanwood",
  county: "Snohomish County",
  tagline: "Junk Removal at the Gateway to Camano Island",
  description: "Stanwood sits at the crossroads of Skagit and Snohomish Counties, serving as the gateway to Camano Island. Whether you're in historic downtown Stanwood, out near the Stillaguamish River, or preparing a property on Camano, Junky Gurus provides fast, friendly junk removal. We're your neighbors — and we're here to help.",
  neighborhoods: [
    "Downtown Stanwood",
    "Cedarhome",
    "Norman Road Area",
    "Viking Way Corridor",
    "East Stanwood",
    "Florence Road Area",
    "Camano Island",
  ],
  landmarks: [
    "Stanwood-Camano School District",
    "Stillaguamish River",
    "Twin City Foods",
    "Stanwood Library",
    "Camano Island State Park",
    "Port Susan",
    "Iverson Spit Preserve",
  ],
  localContext: "From the farming heritage of Stanwood to the waterfront properties on Camano Island, this area has diverse junk removal needs. We've helped farmers clear outbuildings, families declutter before moves, and vacation home owners prepare for the season. Our team knows the area and treats every property with respect.",
  coordinates: { lat: 48.2401, lng: -122.3707 },
};

export default function Stanwood() {
  return <CityLandingPage city={stanwoodData} />;
}
