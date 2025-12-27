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

// Roulette game
export {
  type Prize,
  PRIZES,
  getWeightedRandomPrize,
  generateDiscountCode,
  hasSpunToday,
  recordSpin,
  getLastPrize,
} from "./roulette-prizes";

// Bingo game
export {
  type BingoItem,
  type BingoCard,
  type DiscountTier,
  BINGO_ITEMS,
  DISCOUNT_TIERS,
  generateBingoCard,
  getCompletedLines,
  getLineCount,
  getCurrentTier,
  isBlackout,
  generateBingoCode,
  saveBingoState,
  loadBingoState,
  clearBingoState,
  getCheckedCount,
  wasBingoShownForEstimate,
  markBingoShown,
  resetBingoShown,
} from "./bingo-items";

// Bingo sounds
export {
  playCheckSound,
  playUncheckSound,
  playLineCompleteSound,
  playBlackoutSound,
} from "./bingo-sounds";
