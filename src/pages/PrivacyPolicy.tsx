import { Layout } from "@/components/layout";
import { SEO } from "@/components/shared";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <SEO 
        title="Privacy Policy" 
        description="Read the privacy policy for Junky Gurus junk removal services. Learn how we collect, use, and protect your personal information."
        url="/privacy-policy"
      />
      <div className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              When you use our junk removal services, book an appointment, or contact us, we may collect the following information:
            </p>
            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Personal Information</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li><strong>Contact details:</strong> Name, phone number, and email address</li>
              <li><strong>Physical address:</strong> Service/pickup address including street address, city, state, and ZIP code</li>
              <li><strong>Booking information:</strong> Preferred appointment dates, times, and service requests</li>
            </ul>
            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Service-Related Information</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li><strong>Photos and descriptions:</strong> Images of items for estimation purposes (when you send us photos)</li>
              <li><strong>Service notes:</strong> Details about items to be removed, special instructions, and access information</li>
              <li><strong>Communication records:</strong> Messages, emails, texts, and call logs related to your service</li>
            </ul>
            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Technical Information</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li><strong>Device data:</strong> Browser type, IP address, and device identifiers</li>
              <li><strong>Usage data:</strong> Pages visited, time on site, and interaction with our booking system</li>
              <li><strong>Location data:</strong> General geographic location based on IP address (used for service area verification)</li>
            </ul>
            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">Payment Information</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Payment details are processed securely through third-party payment processors</li>
              <li>We do not store full credit card numbers on our servers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Provide services:</strong> Schedule appointments, navigate to your location, and complete junk removal</li>
              <li><strong>Communicate:</strong> Send booking confirmations, appointment reminders, and service updates via email or text</li>
              <li><strong>Estimate pricing:</strong> Analyze photos and descriptions to provide accurate quotes</li>
              <li><strong>Improve our services:</strong> Understand service patterns and optimize our operations</li>
              <li><strong>Process payments:</strong> Complete transactions and maintain billing records</li>
              <li><strong>Promotional materials:</strong> Send offers and updates (only with your consent, and you can opt out anytime)</li>
              <li><strong>Legal compliance:</strong> Meet regulatory requirements and respond to legal requests</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Information Sharing</h2>
            <p className="text-muted-foreground mb-4">
              We do not sell your personal information. We may share information with:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Service providers:</strong> Third-party services that help us operate (email delivery, payment processing, analytics)</li>
              <li><strong>Navigation services:</strong> Your address may be used with mapping services to route our team to your location</li>
              <li><strong>Donation partners:</strong> When donating items to charities on your behalf (no personal data shared beyond the donation itself)</li>
              <li><strong>Legal authorities:</strong> When required by law, court order, or to protect our legal rights</li>
              <li><strong>Business partners:</strong> Only with your explicit consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Data Retention</h2>
            <p className="text-muted-foreground mb-4">
              We retain your personal information for as long as necessary to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide our services and maintain your booking history</li>
              <li>Comply with legal, accounting, or reporting requirements</li>
              <li>Resolve disputes and enforce our agreements</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Typically, we retain booking records for up to 7 years for tax and legal purposes. You may request deletion 
              of your data at any time, subject to legal retention requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Encryption of data in transit (HTTPS) and at rest</li>
              <li>Secure cloud-based storage with access controls</li>
              <li>Regular security reviews of our systems</li>
              <li>Limited employee access to personal data on a need-to-know basis</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Your Rights</h2>
            <p className="text-muted-foreground mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Access and receive a copy of your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Cookies</h2>
            <p className="text-muted-foreground mb-4">
              Our website uses cookies to enhance your browsing experience. You can manage your cookie 
              preferences at any time using the "Cookie Settings" link in our footer.
            </p>
            
            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Essential Cookies (Always Active)</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Session management and basic site functionality</li>
              <li>Remembering your cookie preferences</li>
              <li>Security and fraud prevention</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Analytics Cookies (Optional)</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Google Analytics - helps us understand how visitors interact with our site</li>
              <li>Collects anonymized data about pages visited, time on site, and user behavior</li>
              <li>You can opt out anytime via "Cookie Settings" in the footer</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6 mb-3">Marketing Cookies (Optional)</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Currently not in use</li>
              <li>May be used in the future for advertising and measuring campaign effectiveness</li>
              <li>Will require your explicit consent before activation</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this privacy policy or your personal data, please contact us at:
            </p>
            <ul className="list-none text-muted-foreground mt-4 space-y-1">
              <li>Phone: (360) 610-9233</li>
              <li>Email: junkygurus@gmail.com</li>
              <li>Location: Mount Vernon, WA</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this privacy policy from time to time. Changes will be posted on this page with an 
              updated revision date.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
