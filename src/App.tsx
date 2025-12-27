import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/shared";
import {
  Index,
  Services,
  ServiceArea,
  Pricing,
  About,
  Contact,
  AIEstimator,
  Referrals,
  Bingo,
  PrivacyPolicy,
  TermsAndConditions,
  FAQ,
  Book,
  NotFound,
  Espanol,
  Discounts,
  AdminLogin,
  AdminDashboard,
  AdminBookings,
  AdminCalendarView,
  AdminHazmatRequests,
  Burlington,
  Anacortes,
  SedroWoolley,
  Bellingham,
} from "@/pages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service-area" element={<ServiceArea />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ai-estimator" element={<AIEstimator />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/bingo" element={<Bingo />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/book" element={<Book />} />
          <Route path="/espanol" element={<Espanol />} />
          <Route path="/discounts" element={<Discounts />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/hazmat" element={<AdminHazmatRequests />} />
          <Route path="/admin/calendar" element={<AdminCalendarView />} />
          <Route path="/junk-removal-burlington-wa" element={<Burlington />} />
          <Route path="/junk-removal-anacortes-wa" element={<Anacortes />} />
          <Route path="/junk-removal-sedro-woolley-wa" element={<SedroWoolley />} />
          <Route path="/junk-removal-bellingham-wa" element={<Bellingham />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
