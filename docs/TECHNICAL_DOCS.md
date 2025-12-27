# Technical Documentation

Comprehensive developer guide for the Junk Removal Web Application.

---

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Project Structure](#project-structure)
3. [Barrel Files & Imports](#barrel-files--imports)
4. [Database Schema](#database-schema)
5. [Edge Functions](#edge-functions)
6. [Authentication & Authorization](#authentication--authorization)
7. [Custom Hooks](#custom-hooks)
8. [Utility Functions](#utility-functions)
9. [Component Patterns](#component-patterns)
10. [Styling & Design System](#styling--design-system)
11. [SEO & Performance](#seo--performance)
12. [Environment Variables](#environment-variables)

---

## Technology Stack

| Category | Technology |
|----------|------------|
| **Framework** | React 18.3 |
| **Build Tool** | Vite |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **UI Components** | shadcn/ui + Radix UI |
| **Routing** | React Router DOM 6.x |
| **State Management** | TanStack Query (React Query) |
| **Backend** | Lovable Cloud (Supabase) |
| **Forms** | React Hook Form + Zod |
| **Animations** | Tailwind CSS Animate |
| **Maps** | Mapbox GL |
| **Markdown** | React Markdown + remark-gfm |
| **Date Handling** | date-fns |
| **Icons** | Lucide React |
| **Toasts** | Sonner + Radix Toast |

---

## Project Structure

```
src/
├── assets/                    # Static assets (images)
├── components/
│   ├── admin/                 # Admin-specific components
│   │   ├── AdminLayout.tsx
│   │   ├── BookingTable.tsx
│   │   ├── HazmatRequestTable.tsx
│   │   └── StatsCards.tsx
│   ├── home/                  # Home page sections
│   │   ├── index.ts           # Barrel file
│   │   ├── HeroSection.tsx
│   │   ├── CTASection.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── ServicesOverview.tsx
│   │   ├── TestimonialsSection.tsx
│   │   └── ...
│   ├── layout/                # Layout components
│   │   ├── index.ts           # Barrel file
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Layout.tsx
│   ├── skeletons/             # Loading skeletons
│   │   ├── index.ts           # Barrel file
│   │   ├── ServiceCardSkeleton.tsx
│   │   └── TestimonialCardSkeleton.tsx
│   ├── ui/                    # shadcn/ui components
│   ├── features.ts            # Feature components barrel
│   ├── shared.ts              # Shared components barrel
│   └── [Component].tsx        # Individual components
├── hooks/
│   ├── index.ts               # Barrel file
│   ├── use-admin-auth.ts
│   ├── use-booking-slots.ts
│   ├── use-exit-intent.ts
│   ├── use-google-analytics.ts
│   ├── use-loading-delay.ts
│   ├── use-mobile.tsx
│   ├── use-scroll-animation.tsx
│   └── use-toast.ts
├── integrations/
│   └── supabase/
│       ├── client.ts          # Supabase client (auto-generated)
│       └── types.ts           # Database types (auto-generated)
├── lib/
│   ├── index.ts               # Barrel file
│   ├── utils.ts               # Core utilities (cn)
│   ├── contact-info.ts        # Contact constants
│   ├── cookies.ts             # Cookie consent management
│   ├── exit-intent.ts         # Exit intent utilities
│   ├── roulette-prizes.ts     # Roulette game logic
│   ├── bingo-items.ts         # Bingo game logic
│   └── bingo-sounds.ts        # Bingo sound effects
├── pages/
│   ├── index.ts               # Barrel file
│   ├── admin/                 # Admin pages
│   ├── cities/                # City landing pages
│   └── [Page].tsx             # Main pages
├── App.tsx                    # App entry with routing
├── main.tsx                   # React entry point
└── index.css                  # Global styles & design tokens

supabase/
├── config.toml                # Supabase configuration
└── functions/                 # Edge functions
    ├── analyze-demolition/
    ├── analyze-junk/
    ├── chat-assistant/
    └── send-contact-email/

public/
├── .well-known/               # AI plugin & OpenAPI specs
├── favicon.png
├── og-image.jpg
├── robots.txt
├── sitemap.xml
└── llms.txt                   # LLM documentation
```

---

## Barrel Files & Imports

Barrel files centralize exports for cleaner imports. See [BARREL_FILES.md](./BARREL_FILES.md) for complete reference.

### Quick Reference

```tsx
// Pages
import { Index, About, Services, AdminDashboard } from "@/pages";

// Layout
import { Layout, Header, Footer } from "@/components/layout";

// Home sections
import { HeroSection, CTASection, HowItWorks } from "@/components/home";

// Shared components
import { PhoneLink, SEO, BookingSlotPicker, FormField } from "@/components/shared";

// Feature components
import { JunkAnalyzer, AIAssistant, CookieConsent } from "@/components/features";

// Skeletons
import { ServiceCardSkeletonGrid, TestimonialSkeletonGrid } from "@/components/skeletons";

// Hooks
import { useToast, useScrollAnimation, useBookingSlots, useAdminAuth } from "@/hooks";

// Utilities
import { cn, CONTACT_INFO, PRIZES, generateBingoCard } from "@/lib";
```

---

## Database Schema

### Tables

#### `bookings`
Stores customer booking requests.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | No | `gen_random_uuid()` | Primary key |
| `name` | TEXT | No | - | Customer name |
| `email` | TEXT | No | - | Customer email |
| `phone` | TEXT | Yes | - | Customer phone |
| `booking_date` | TEXT | No | - | Selected date |
| `booking_time` | TEXT | No | - | Selected time slot |
| `message` | TEXT | Yes | - | Additional notes |
| `status` | TEXT | No | `'pending'` | Booking status |
| `created_at` | TIMESTAMPTZ | No | `now()` | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | No | `now()` | Last update timestamp |

#### `hazmat_requests`
Stores hazardous material removal requests.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | No | `gen_random_uuid()` | Primary key |
| `name` | TEXT | No | - | Customer name |
| `email` | TEXT | No | - | Customer email |
| `phone` | TEXT | No | - | Customer phone |
| `address` | TEXT | No | - | Service address |
| `materials` | JSONB | No | `'{}'` | Hazmat materials list |
| `preferred_date` | TEXT | Yes | - | Preferred date |
| `preferred_time` | TEXT | Yes | - | Preferred time |
| `notes` | TEXT | Yes | - | Additional notes |
| `status` | TEXT | No | `'pending'` | Request status |
| `created_at` | TIMESTAMPTZ | No | `now()` | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | No | `now()` | Last update timestamp |

#### `user_roles`
Stores user role assignments for admin access.

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | No | `gen_random_uuid()` | Primary key |
| `user_id` | UUID | No | - | Auth user ID |
| `role` | `app_role` | No | - | Role enum (`admin`, `user`) |
| `created_at` | TIMESTAMPTZ | Yes | `now()` | Creation timestamp |

### Database Functions

#### `has_role(_user_id UUID, _role app_role) → BOOLEAN`
Checks if a user has a specific role.

```sql
SELECT has_role('user-uuid-here', 'admin');
```

#### `update_updated_at_column() → TRIGGER`
Automatically updates `updated_at` timestamp on row updates.

---

## Edge Functions

### `analyze-junk`
AI-powered junk analysis from uploaded images.

**Endpoint:** `POST /functions/v1/analyze-junk`

**Request Body:**
```json
{
  "image": "base64-encoded-image-data"
}
```

**Response:**
```json
{
  "items": ["couch", "mattress", "boxes"],
  "estimatedVolume": "1/2 truck load",
  "estimatedPrice": "$200-$300",
  "recommendations": ["Consider donating usable items"]
}
```

### `analyze-demolition`
AI-powered demolition project analysis.

**Endpoint:** `POST /functions/v1/analyze-demolition`

### `chat-assistant`
AI chat assistant for customer inquiries.

**Endpoint:** `POST /functions/v1/chat-assistant`

**Request Body:**
```json
{
  "message": "What services do you offer?",
  "conversationHistory": []
}
```

### `send-contact-email`
Sends contact form emails via Resend.

**Endpoint:** `POST /functions/v1/send-contact-email`

**Required Secret:** `RESEND_API_KEY`

---

## Authentication & Authorization

### Admin Authentication

Uses Supabase Auth with role-based access control.

```tsx
import { useAdminAuth } from "@/hooks";

function AdminPage() {
  const { isAdmin, isLoading, user, signIn, signOut } = useAdminAuth();
  
  if (isLoading) return <Loading />;
  if (!isAdmin) return <Redirect to="/admin/login" />;
  
  return <AdminDashboard />;
}
```

### Role Checking

```tsx
// In database queries
const { data } = await supabase
  .rpc('has_role', { _user_id: user.id, _role: 'admin' });
```

---

## Custom Hooks

### `useAdminAuth`
Manages admin authentication state.

```tsx
const { isAdmin, isLoading, user, signIn, signOut } = useAdminAuth();
```

### `useBookingSlots`
Manages booking slot availability.

```tsx
const { availableSlots, isLoading, bookSlot } = useBookingSlots(selectedDate);
```

### `useExitIntent`
Detects exit intent for popup triggers.

```tsx
const { showPopup, dismissPopup } = useExitIntent();
```

### `useScrollAnimation`
Triggers animations on scroll into view.

```tsx
const { ref, isVisible } = useScrollAnimation();
```

### `useIsMobile`
Detects mobile viewport.

```tsx
const isMobile = useIsMobile();
```

### `useLoadingDelay`
Delays loading state for skeleton displays.

```tsx
const showSkeleton = useLoadingDelay(isLoading, 200);
```

### `useGoogleAnalytics`
Tracks page views and events.

```tsx
useGoogleAnalytics();
```

### `useToast`
Toast notification system.

```tsx
const { toast } = useToast();
toast({ title: "Success!", description: "Booking confirmed." });
```

---

## Utility Functions

### Core Utilities (`@/lib`)

```tsx
import { cn } from "@/lib";

// Merge Tailwind classes conditionally
<div className={cn("base-class", isActive && "active-class")} />
```

### Cookie Management

```tsx
import { 
  getConsentPreferences, 
  setConsentPreferences,
  acceptAllCookies,
  acceptEssentialOnly 
} from "@/lib";
```

### Gamification

```tsx
import { 
  PRIZES, 
  getWeightedRandomPrize,
  generateBingoCard,
  getCompletedLines 
} from "@/lib";
```

---

## Component Patterns

### Page Component Pattern

```tsx
import { Layout } from "@/components/layout";
import { SEO } from "@/components/shared";

export default function ExamplePage() {
  return (
    <Layout>
      <SEO 
        title="Page Title | Company Name"
        description="Page description for SEO"
        canonical="/page-url"
      />
      <main className="container mx-auto px-4 py-8">
        {/* Page content */}
      </main>
    </Layout>
  );
}
```

### Form Component Pattern

```tsx
import { FormField } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks";

export function ContactForm() {
  const { toast } = useToast();
  
  const handleSubmit = async (data: FormData) => {
    try {
      // Submit logic
      toast({ title: "Success!", description: "Form submitted." });
    } catch (error) {
      toast({ title: "Error", description: "Something went wrong.", variant: "destructive" });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <FormField label="Name" name="name" required />
      <FormField label="Email" name="email" type="email" required />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Loading State Pattern

```tsx
import { ServiceCardSkeletonGrid } from "@/components/skeletons";
import { useLoadingDelay } from "@/hooks";

function ServiceList({ isLoading, services }) {
  const showSkeleton = useLoadingDelay(isLoading, 200);
  
  if (showSkeleton) return <ServiceCardSkeletonGrid count={6} />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {services.map(service => <ServiceCard key={service.id} {...service} />)}
    </div>
  );
}
```

---

## Styling & Design System

### CSS Variables (index.css)

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 142 76% 36%;
  --primary-foreground: 355.7 100% 97.3%;
  --secondary: 210 40% 96.1%;
  --muted: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
  --border: 214.3 31.8% 91.4%;
  --ring: 142 76% 36%;
  --radius: 0.5rem;
}
```

### Tailwind Usage

```tsx
// ✅ Correct - Use semantic tokens
<div className="bg-background text-foreground" />
<button className="bg-primary text-primary-foreground" />

// ❌ Wrong - Direct colors
<div className="bg-white text-black" />
```

### Component Variants (shadcn)

```tsx
// Button variants
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
```

---

## SEO & Performance

### SEO Component Usage

```tsx
import { SEO } from "@/components/shared";

<SEO
  title="Junk Removal Services | Company Name"
  description="Professional junk removal services in Skagit County. Fast, reliable, and affordable."
  canonical="/services"
  ogImage="/og-image.jpg"
/>
```

### Performance Best Practices

1. **Lazy Loading:** Use skeleton components for loading states
2. **Image Optimization:** Use optimized images in `src/assets/`
3. **Code Splitting:** Pages are automatically code-split via React Router
4. **Caching:** TanStack Query handles data caching

---

## Environment Variables

### Available Variables

| Variable | Description | Usage |
|----------|-------------|-------|
| `VITE_SUPABASE_URL` | Supabase project URL | Edge function calls |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key | Client initialization |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID | Various integrations |

### Edge Function Secrets

| Secret | Description |
|--------|-------------|
| `LOVABLE_API_KEY` | Lovable AI API key |
| `RESEND_API_KEY` | Resend email service key |
| `SUPABASE_URL` | Supabase URL (server-side) |
| `SUPABASE_ANON_KEY` | Supabase anon key (server-side) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |

---

## Quick Start for New Developers

1. **Clone and Install:**
   ```bash
   npm install
   npm run dev
   ```

2. **Understand the Import System:**
   - Use barrel files for all imports
   - See [BARREL_FILES.md](./BARREL_FILES.md) for reference

3. **Adding New Pages:**
   - Create page in `src/pages/`
   - Add export to `src/pages/index.ts`
   - Add route in `src/App.tsx`

4. **Adding New Components:**
   - Create in appropriate directory
   - Add to relevant barrel file
   - Follow existing patterns

5. **Database Changes:**
   - Use Lovable migration tool
   - Update types automatically regenerated

---

*Last updated: December 2024*
