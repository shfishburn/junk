import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";

export default function TermsAndConditions() {
  return (
    <Layout>
      <SEO 
        title="Terms and Conditions | Junky Gurus" 
        description="Read the terms and conditions for Junky Gurus junk removal services. Understand our service agreement, liability, and policies."
      />
      <div className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto prose prose-slate dark:prose-invert">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">Terms and Conditions</h1>
          <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Agreement to Terms</h2>
            <p className="text-muted-foreground">
              By using Junky Gurus' services, you agree to be bound by these Terms and Conditions. If you do not 
              agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Services Provided</h2>
            <p className="text-muted-foreground mb-4">
              Junky Gurus provides junk removal, hauling, and disposal services in the Mount Vernon and North Sound 
              region. Our services include but are not limited to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Residential junk removal</li>
              <li>Commercial cleanouts</li>
              <li>Construction debris removal</li>
              <li>Appliance and furniture removal</li>
              <li>Yard waste disposal</li>
              <li>Estate and foreclosure cleanouts</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Pricing and Payment</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Quotes are estimates based on the information provided and may change upon on-site assessment</li>
              <li>Final pricing is determined by the volume, weight, and type of items removed</li>
              <li>Payment is due upon completion of services</li>
              <li>We accept cash, credit cards, and other approved payment methods</li>
              <li>Additional fees may apply for hazardous materials, excessive weight, or special handling requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Scheduling and Cancellation</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Appointments are scheduled based on availability</li>
              <li>Please provide at least 24 hours notice for cancellations or rescheduling</li>
              <li>Late cancellations or no-shows may result in a cancellation fee</li>
              <li>We reserve the right to reschedule due to weather or unforeseen circumstances</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Items We Cannot Accept</h2>
            <p className="text-muted-foreground mb-4">
              For safety and regulatory reasons, we cannot remove certain items including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Hazardous materials (chemicals, asbestos, lead paint)</li>
              <li>Medical waste and biohazards</li>
              <li>Explosives and ammunition</li>
              <li>Radioactive materials</li>
              <li>Certain electronics (specific restrictions may apply)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Customer Responsibilities</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Ensure clear access to items for removal</li>
              <li>Accurately describe items to be removed when requesting a quote</li>
              <li>Notify us of any hazardous conditions or materials</li>
              <li>Secure pets and valuables during service</li>
              <li>Be present or have an authorized representative present during service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Liability</h2>
            <p className="text-muted-foreground mb-4">
              Junky Gurus is fully licensed and insured. However:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>We are not liable for damage to items designated for removal</li>
              <li>Pre-existing property damage must be documented before service begins</li>
              <li>Claims for property damage must be reported within 24 hours of service</li>
              <li>Our liability is limited to the cost of repair or fair market value, whichever is less</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Disposal and Recycling</h2>
            <p className="text-muted-foreground">
              We strive to dispose of items responsibly. Whenever possible, we donate usable items to local charities, 
              recycle appropriate materials, and dispose of remaining items at licensed facilities. Once items are 
              removed from your property, they become the property of Junky Gurus.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to indemnify and hold harmless Junky Gurus, its owners, employees, and contractors from any 
              claims, damages, or expenses arising from your use of our services or violation of these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Governing Law</h2>
            <p className="text-muted-foreground">
              These terms are governed by the laws of the State of Washington. Any disputes will be resolved in the 
              courts of Skagit County, Washington.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about these terms, please contact us:
            </p>
            <ul className="list-none text-muted-foreground mt-4 space-y-1">
              <li>Phone: (360) 610-9233</li>
              <li>Email: info@junkygurus.com</li>
              <li>Location: Mount Vernon, WA</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Continued use of our services after changes 
              constitutes acceptance of the updated terms.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
