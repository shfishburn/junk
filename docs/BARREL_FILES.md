# Barrel Files Summary

This document provides an overview of all barrel (index) files used for centralized component exports in the codebase.

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
```

---

## Benefits

1. **Cleaner imports** - Single import statement for multiple components
2. **Maintainability** - Centralized export management
3. **Discoverability** - Easy to find available components
4. **Refactoring** - Change file locations without updating all imports
5. **Tree-shaking** - Only imported components are bundled
