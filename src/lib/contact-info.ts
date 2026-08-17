// Centralized contact information constants
// Used by PhoneLink, EmailLink, TextUsLink, and ContactInfoCard

export const CONTACT_INFO = {
  phones: [
    { number: "+13606109233", display: "(360) 610-9233" },
    { number: "+13604886375", display: "(360) 488-6375" },
  ],
  emails: [
    { address: "junkygurus@gmail.com", label: "General Inquiries & Bookings" },
  ],
  email: "junkygurus@gmail.com", // Primary email for backward compatibility
  location: "Mount Vernon, WA",
  serviceArea: "Serving Skagit, Whatcom & Snohomish Counties",
};

export type PhoneInfo = typeof CONTACT_INFO.phones[0];
export type EmailInfo = typeof CONTACT_INFO.emails[0];
