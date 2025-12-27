# Barrel Files Summary

This document provides an overview of all barrel (index) files used for centralized component and hook exports in the codebase.

---

## 📁 `@/components/shared`
**File:** `src/components/shared.ts`

Shared utility components used across multiple pages.

### Contact & Communication
| Export | Description |
|--------|-------------|
| `PhoneLink` | Clickable phone number link |
| `EmailLink` | Clickable email link |
| `TextUsLink` | SMS/text message link |
| `ContactInfoCard` | Contact information display card |
| `CONTACT_INFO` | Contact data constant |

### Business Info
| Export | Description |
|--------|-------------|
| `BusinessHours` | Business hours display component |
| `BUSINESS_HOURS` | Business hours data constant |
| `ServiceAreaInfo` | Service area information component |
| `CountyCard` | County display card |
| `SERVICE_AREA_DATA` | Service area data constant |

### Form Components
| Export | Description |
|--------|-------------|
| `FormField` | Reusable form input field |
| `TextareaField` | Reusable textarea field |

### Layout & Navigation
| Export | Description |
|--------|-------------|
| `Breadcrumbs` | Breadcrumb navigation |
| `PageTransition` | Page transition animations |
| `ScrollToTop` | Scroll to top on route change |
| `SEO` | SEO meta tags component |

### Booking Components
| Export | Description |
|--------|-------------|
| `BookingCalendar` | Date picker calendar |
| `BookingSlotPicker` | Combined date/time slot picker |
| `DateTimePicker` | Date and time selection |
| `TimeSlotGrid` | Available time slots grid |

### Feature Components
| Export | Description |
|--------|-------------|
| `DiscountBadge` | Discount display badge |
| `ReferralWidget` | Referral program widget |

---

## 📁 `@/components/features`
**File:** `src/components/features.ts`

Interactive feature components and complex UI elements.

| Export | Description |
|--------|-------------|
| `AIAssistant` | AI chat assistant component |
| `CookieConsent` | Cookie consent banner |
| `openCookiePreferences` | Function to open cookie preferences |
| `CookiePreferencesModal` | Cookie preferences modal |
| `ExitIntentPopup` | Exit intent popup |
| `JunkAnalyzer` | AI junk analysis tool |
| `DemolitionAnalyzer` | AI demolition analysis tool |
| `JunkRoulette` | Gamification roulette wheel |
| `JunkRouletteModal` | Roulette wheel modal |
| `JunkBingoCard` | Bingo game card |
| `JunkBingoModal` | Bingo game modal |
| `HazmatBookingForm` | Hazmat service booking form |
| `ServiceAreaMap` | Interactive service area map |

---

## 📁 `@/components/layout`
**File:** `src/components/layout/index.ts`

Core layout components for page structure.

| Export | Description |
|--------|-------------|
| `Header` | Site header with navigation |
| `Footer` | Site footer |
| `Layout` | Main layout wrapper component |

---

## 📁 `@/components/home`
**File:** `src/components/home/index.ts`

Home page section components.

| Export | Description |
|--------|-------------|
| `AIEstimatorCTA` | AI estimator call-to-action section |
| `CTASection` | Main call-to-action section |
| `GamificationCTA` | Gamification features CTA |
| `HeroSection` | Hero banner section |
| `HowItWorks` | Process explanation section |
| `NoSurprises` | Pricing transparency section |
| `ServiceAreaSection` | Service area overview |
| `ServicesOverview` | Services grid section |
| `TestimonialsSection` | Customer testimonials |
| `TrustSignals` | Trust badges and signals |

---

## 📁 `@/components/skeletons`
**File:** `src/components/skeletons/index.ts`

Loading skeleton components for better UX.

| Export | Description |
|--------|-------------|
| `ServiceCardSkeleton` | Single service card skeleton |
| `ServiceCardSkeletonGrid` | Grid of service card skeletons |
| `TestimonialCardSkeleton` | Single testimonial skeleton |
| `TestimonialSkeletonGrid` | Grid of testimonial skeletons |

---

## 📁 `@/hooks`
**File:** `src/hooks/index.ts`

Custom React hooks for shared functionality.

| Export | Description |
|--------|-------------|
| `useAdminAuth` | Admin authentication state and actions |
| `useBookingSlots` | Booking availability and slot management |
| `TIME_SLOTS` | Available time slots constant |
| `useExitIntent` | Exit intent detection for popups |
| `useGoogleAnalytics` | Google Analytics integration |
| `useLoadingDelay` | Delayed loading state for skeletons |
| `useIsMobile` | Mobile device detection |
| `useScrollAnimation` | Scroll-triggered animations |
| `useToast` | Toast notification hook |
| `toast` | Toast notification function |

---

## 📁 `@/lib`
**File:** `src/lib/index.ts`

Utility functions and constants used across the application.

### Core Utilities
| Export | Description |
|--------|-------------|
| `cn` | Tailwind class name merge utility |

### Contact Information
| Export | Description |
|--------|-------------|
| `CONTACT_INFO` | Contact data constant |
| `PhoneInfo` | Phone info type |

### Cookie Management
| Export | Description |
|--------|-------------|
| `CookieCategory` | Cookie category type |
| `CookiePreferences` | Cookie preferences type |
| `defaultPreferences` | Default cookie preferences |
| `getConsentPreferences` | Get current consent preferences |
| `setConsentPreferences` | Set consent preferences |
| `hasConsentBeenGiven` | Check if consent was given |
| `isCategoryConsented` | Check if category is consented |
| `acceptAllCookies` | Accept all cookies |
| `acceptEssentialOnly` | Accept essential cookies only |
| `resetCookieConsent` | Reset cookie consent |

### Exit Intent
| Export | Description |
|--------|-------------|
| `hasSeenExitPopup` | Check if exit popup was seen |
| `markExitPopupSeen` | Mark exit popup as seen |
| `hasClaimedExitDiscount` | Check if discount was claimed |
| `markExitDiscountClaimed` | Mark discount as claimed |
| `getExitDiscountCode` | Get exit discount code |
| `generateExitDiscountCode` | Generate new discount code |

### Roulette Game
| Export | Description |
|--------|-------------|
| `Prize` | Prize type |
| `PRIZES` | Available prizes constant |
| `getWeightedRandomPrize` | Get random weighted prize |
| `generateDiscountCode` | Generate discount code |
| `hasSpunToday` | Check if user spun today |
| `recordSpin` | Record a spin |
| `getLastPrize` | Get last won prize |

### Bingo Game
| Export | Description |
|--------|-------------|
| `BingoItem` | Bingo item type |
| `BingoCard` | Bingo card type |
| `DiscountTier` | Discount tier type |
| `BINGO_ITEMS` | Bingo items constant |
| `DISCOUNT_TIERS` | Discount tiers constant |
| `generateBingoCard` | Generate bingo card |
| `getCompletedLines` | Get completed lines |
| `getLineCount` | Get line count |
| `getCurrentTier` | Get current discount tier |
| `isBlackout` | Check for blackout |
| `generateBingoCode` | Generate bingo code |
| `saveBingoState` | Save bingo state |
| `loadBingoState` | Load bingo state |
| `clearBingoState` | Clear bingo state |
| `getCheckedCount` | Get checked count |
| `wasBingoShownForEstimate` | Check if bingo was shown |
| `markBingoShown` | Mark bingo as shown |
| `resetBingoShown` | Reset bingo shown state |

### Bingo Sounds
| Export | Description |
|--------|-------------|
| `playCheckSound` | Play check sound |
| `playUncheckSound` | Play uncheck sound |
| `playLineCompleteSound` | Play line complete sound |
| `playBlackoutSound` | Play blackout sound |

---

## 📁 `@/pages`
**File:** `src/pages/index.ts`

Page components for routing.

### Main Pages
| Export | Description |
|--------|-------------|
| `Index` | Home page |
| `About` | About us page |
| `Services` | Services listing page |
| `Pricing` | Pricing information page |
| `Book` | Booking page |
| `Contact` | Contact page |
| `FAQ` | Frequently asked questions |
| `ServiceArea` | Service area information |

### Feature Pages
| Export | Description |
|--------|-------------|
| `AIEstimator` | AI junk estimation tool |
| `Bingo` | Junk bingo game page |
| `Discounts` | Discounts page |
| `Referrals` | Referral program page |

### Legal Pages
| Export | Description |
|--------|-------------|
| `PrivacyPolicy` | Privacy policy page |
| `TermsAndConditions` | Terms and conditions page |

### Localized Pages
| Export | Description |
|--------|-------------|
| `Espanol` | Spanish language page |

### Error Pages
| Export | Description |
|--------|-------------|
| `NotFound` | 404 error page |

### Admin Pages
| Export | Description |
|--------|-------------|
| `AdminLogin` | Admin login page |
| `AdminDashboard` | Admin dashboard |
| `AdminBookings` | Admin bookings management |
| `AdminCalendarView` | Admin calendar view |
| `AdminHazmatRequests` | Admin hazmat requests |

### City Landing Pages
| Export | Description |
|--------|-------------|
| `Anacortes` | Anacortes city page |
| `Bellingham` | Bellingham city page |
| `Burlington` | Burlington city page |
| `SedroWoolley` | Sedro-Woolley city page |

---

## Usage Examples

```tsx
// Import from shared components
import { PhoneLink, SEO, BookingSlotPicker } from "@/components/shared";

// Import from features
import { JunkAnalyzer, CookieConsent } from "@/components/features";

// Import from layout
import { Layout } from "@/components/layout";

// Import from home
import { HeroSection, CTASection } from "@/components/home";

// Import from skeletons
import { ServiceCardSkeletonGrid } from "@/components/skeletons";

// Import from hooks
import { useToast, useScrollAnimation, useBookingSlots } from "@/hooks";

// Import from lib
import { cn, CONTACT_INFO, getConsentPreferences, PRIZES } from "@/lib";

// Import from pages
import { Index, About, Services, AdminDashboard } from "@/pages";
```

---

## Benefits

1. **Cleaner imports** - Single import statement for multiple components
2. **Maintainability** - Centralized export management
3. **Discoverability** - Easy to find available components
4. **Refactoring** - Change file locations without updating all imports
5. **Tree-shaking** - Only imported components are bundled
