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
              When you use our junk removal services or contact us, we may collect the following information:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Name and contact information (phone number, email address)</li>
              <li>Service address and location details</li>
              <li>Photos of items for estimation purposes</li>
              <li>Communication records and service history</li>
              <li>Payment information (processed securely through third-party providers)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide and improve our junk removal services</li>
              <li>Communicate with you about appointments and quotes</li>
              <li>Process payments and maintain service records</li>
              <li>Send promotional materials (with your consent)</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Information Sharing</h2>
            <p className="text-muted-foreground mb-4">
              We do not sell your personal information. We may share information with:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Service providers who assist in our operations</li>
              <li>Legal authorities when required by law</li>
              <li>Business partners with your explicit consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Data Security</h2>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your personal information from unauthorized access, 
              alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
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
              <li>Email: info@junkygurus.com</li>
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
