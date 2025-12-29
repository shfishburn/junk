// Google Analytics event tracking utility

type GAEventParams = {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: unknown;
};

/**
 * Track a custom event in Google Analytics
 */
export function trackEvent(
  eventName: string,
  params?: GAEventParams
): void {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

// Pre-defined event helpers for common actions

export function trackPhoneClick(phoneNumber: string): void {
  trackEvent('phone_click', {
    event_category: 'Contact',
    event_label: phoneNumber,
  });
}

export function trackTextClick(phoneNumber: string): void {
  trackEvent('text_click', {
    event_category: 'Contact',
    event_label: phoneNumber,
  });
}

export function trackEmailClick(email: string): void {
  trackEvent('email_click', {
    event_category: 'Contact',
    event_label: email,
  });
}

export function trackBookingSubmit(date: string, time: string): void {
  trackEvent('booking_submit', {
    event_category: 'Booking',
    event_label: `${date} at ${time}`,
  });
}

export function trackContactFormSubmit(serviceType?: string): void {
  trackEvent('contact_form_submit', {
    event_category: 'Contact',
    event_label: serviceType || 'general',
  });
}

export function trackAIEstimatorUse(): void {
  trackEvent('ai_estimator_use', {
    event_category: 'Engagement',
  });
}

export function trackRouletteWin(prize: string): void {
  trackEvent('roulette_win', {
    event_category: 'Engagement',
    event_label: prize,
  });
}
