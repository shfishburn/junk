// Centralized contact information constants
// Used by PhoneLink, EmailLink, TextUsLink, and ContactInfoCard

export const CONTACT_INFO = {
  phones: [
    { number: "+13606109233", display: "(360) 610-9233" },
    { number: "+13604222428", display: "(360) 422-2428" },
  ],
  emails: [
    { address: "junkygurus@gmail.com", label: "General Inquiries & Bookings" },
  ],
  email: "junkygurus@gmail.com", // Primary email for backward compatibility
  location: "Mount Vernon, WA",
  serviceArea: "Serving Skagit, Whatcom, Snohomish & King Counties",
};

export type PhoneInfo = typeof CONTACT_INFO.phones[0];
export type EmailInfo = typeof CONTACT_INFO.emails[0];
