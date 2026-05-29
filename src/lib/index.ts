// Lib Barrel File - Utilities and Constants

// Core utilities
export { cn } from "./utils";

// Contact information
export { CONTACT_INFO, type PhoneInfo } from "./contact-info";

// Cookie management
export {
  type CookieCategory,
  type CookiePreferences,
  defaultPreferences,
  getConsentPreferences,
  setConsentPreferences,
  hasConsentBeenGiven,
  isCategoryConsented,
  acceptAllCookies,
  acceptEssentialOnly,
  resetCookieConsent,
} from "./cookies";

// Exit intent utilities
export {
  hasSeenExitPopup,
  markExitPopupSeen,
  hasClaimedExitDiscount,
  markExitDiscountClaimed,
  getExitDiscountCode,
  generateExitDiscountCode,
} from "./exit-intent";


// Analytics
export {
  trackEvent,
  trackPhoneClick,
  trackTextClick,
  trackEmailClick,
  trackBookingSubmit,
  trackContactFormSubmit,
  trackAIEstimatorUse,
  trackAIEstimatorBooking,
  trackHazmatRequest,
  trackServicePageView,
  trackCityPageView,
} from "./analytics";

// Image utilities
export {
  compressImageForStorage,
  compressImagesForStorage,
} from "./image-utils";
