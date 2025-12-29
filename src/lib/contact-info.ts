// Centralized contact information constants
// Used by PhoneLink, EmailLink, TextUsLink, and ContactInfoCard

export const CONTACT_INFO = {
  phones: [
    { number: "+13606109233", display: "(360) 610-9233" },
    { number: "+13604222428", display: "(360) 422-2428" },
  ],
  email: "contact@thejunkygurus.com",
  location: "Mount Vernon, WA",
  serviceArea: "Serving Skagit, Whatcom, Snohomish & King Counties",
};

export type PhoneInfo = typeof CONTACT_INFO.phones[0];
