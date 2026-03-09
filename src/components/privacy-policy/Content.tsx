import { PolicySection } from './PolicySec';
import { PolicyList } from './PolicyList';
import { PolicyCallout } from './PolicyCallout';

import {
  Lock, Eye, FileText, AlertCircle, Database, Globe, Mail,
} from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen text-white bg-black">
      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Introduction */}
          <p className="text-gray-300" style={{ lineHeight: 1.8 }}>
            Welcome to SamCard. We respect your privacy and are committed to protecting your
            personal data. This privacy policy will inform you about how we look after your personal
            data when you visit our website or use our services, and tell you about your privacy
            rights and how the law protects you.
          </p>

          {/* Information We Collect */}
          <PolicySection id="information-collection" icon={Database} title="Information We Collect">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">
                Personal Information You Provide
              </h3>
              <PolicyList items={[
                'Account registration data (name, email address, password)',
                'Profile information (job title, company name, phone number)',
                'Digital business card content (contact details, social media links, bio)',
                'Payment information (processed securely through third-party payment processors)',
                'Communications with us (support requests, feedback)',
              ]} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">
                Information We Collect Automatically
              </h3>
              <PolicyList items={[
                'Device information (IP address, browser type, operating system)',
                'Usage data (pages visited, features used, time spent)',
                'Analytics data (interactions, click patterns, session recordings)',
                'Card sharing and viewing statistics',
                'Location data (general location based on IP address)',
              ]} />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">
                Information from Third Parties
              </h3>
              <PolicyList items={[
                'Social media profile data (when you connect social accounts)',
                'Authentication providers (Google, LinkedIn, etc.)',
                'Payment processors (transaction confirmations)',
              ]} />
            </div>
          </PolicySection>

          {/* How We Use Your Information */}
          <PolicySection id="how-we-use" icon={FileText} title="How We Use Your Information">
            <p>We use your personal information for the following purposes:</p>
            <PolicyList items={[
              { label: 'Service Provision', text: 'To create and manage your digital business cards, provide access to our platform features, and deliver the services you request' },
              { label: 'Account Management', text: 'To create and maintain your account, authenticate your identity, and provide customer support' },
              { label: 'Analytics & Improvement', text: 'To analyze usage patterns, improve our services, develop new features, and enhance user experience' },
              { label: 'Communications', text: 'To send service-related notifications, updates, security alerts, and marketing communications (with your consent)' },
              { label: 'Payment Processing', text: 'To process transactions, prevent fraud, and manage billing' },
              { label: 'Legal Compliance', text: 'To comply with legal obligations, enforce our terms, and protect our rights and the rights of our users' },
              { label: 'Personalization', text: 'To customize your experience and provide relevant content and recommendations' },
            ]} />
          </PolicySection>

          {/* Data Sharing */}
          <PolicySection id="data-sharing" icon={Globe} title="Data Sharing and Disclosure">
            <p>We may share your personal information in the following circumstances:</p>
            <PolicyList items={[
              { label: 'Public Card Information', text: 'Information you choose to include on your digital business card is shared when you distribute your card' },
              { label: 'Service Providers', text: 'We share data with trusted third-party service providers who assist us in operating our platform (hosting, analytics, payment processing, email services)' },
              { label: 'Business Transfers', text: 'In connection with any merger, acquisition, or sale of assets, your information may be transferred' },
              { label: 'Legal Requirements', text: 'When required by law, court order, or government regulation' },
              { label: 'Protection of Rights', text: 'To protect our rights, property, safety, or that of our users or the public' },
              { label: 'With Your Consent', text: 'When you explicitly authorize us to share your information' },
            ]} />
            <PolicyCallout variant="accent">
              <strong className="text-white">Note:</strong> We do not sell your personal information to third parties for their marketing purposes.
            </PolicyCallout>
          </PolicySection>

          {/* Your Rights */}
          <PolicySection id="your-rights" icon={Eye} title="Your Privacy Rights">
            <p>Depending on your location, you may have the following rights:</p>
            <PolicyList items={[
              { label: 'Access', text: 'Request a copy of the personal information we hold about you' },
              { label: 'Correction', text: 'Request correction of inaccurate or incomplete information' },
              { label: 'Deletion', text: 'Request deletion of your personal information (right to be forgotten)' },
              { label: 'Data Portability', text: 'Request a copy of your data in a structured, machine-readable format' },
              { label: 'Objection', text: 'Object to our processing of your personal information' },
              { label: 'Restriction', text: 'Request restriction of processing in certain circumstances' },
              { label: 'Withdraw Consent', text: 'Withdraw consent for processing based on consent' },
              { label: 'Opt-Out', text: 'Opt out of marketing communications at any time' },
            ]} />
            <PolicyCallout variant="subtle">
              <p className="font-semibold text-white mb-1">How to Exercise Your Rights</p>
              <p>
                To exercise any of these rights, please contact us at{' '}
                <a
                  href="mailto:privacy@SamCard.com"
                  className="text-theme-kelly-green hover:underline"
                >
                  privacy@SamCard.com
                </a>
                . We will respond to your request within 30 days.
              </p>
            </PolicyCallout>
          </PolicySection>

          {/* Data Security */}
          <PolicySection id="security" icon={Lock} title="Data Security">
            <p>
              We implement appropriate technical and organizational security measures to protect your
              personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <PolicyList items={[
              'Data encryption in transit (TLS/SSL) and at rest',
              'Secure authentication and access controls',
              'Regular security audits and vulnerability assessments',
              'Employee training on data protection and security',
              'Incident response and breach notification procedures',
              'Regular backups and disaster recovery plans',
            ]} />
            <p>
              While we strive to protect your personal information, no method of transmission over
              the internet or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </PolicySection>

          {/* Data Retention */}
          <PolicySection icon={AlertCircle} title="Data Retention">
            <p>
              We retain your personal information for as long as necessary to fulfill the purposes
              outlined in this policy, unless a longer retention period is required or permitted by law.
            </p>
            <PolicyList items={[
              { label: 'Active Accounts', text: 'While your account is active and for a reasonable period thereafter' },
              { label: 'Business Records', text: 'Transaction records retained for accounting and legal compliance (typically 7 years)' },
              { label: 'Marketing Data', text: 'Until you opt out or withdraw consent' },
              { label: 'Analytics Data', text: 'Typically aggregated and anonymized after 26 months' },
            ]} />
            <p>When we no longer need your personal information, we will securely delete or anonymize it.</p>
          </PolicySection>

          {/* International Transfers */}
          <div className="space-y-4 text-gray-300">
            <h2 className="text-2xl font-bold text-white">
              International Data Transfers
            </h2>
            <p>
              Your information may be transferred to, stored, and processed in countries other than
              your country of residence. These countries may have data protection laws that differ
              from those in your country.
            </p>
            <p>We ensure appropriate safeguards are in place, including:</p>
            <PolicyList items={[
              'Standard contractual clauses approved by the European Commission',
              'Privacy Shield frameworks (where applicable)',
              'Adequacy decisions by data protection authorities',
            ]} />
          </div>

          {/* Children */}
          <div className="space-y-4 text-gray-300">
            <h2 className="text-2xl font-bold text-white">
              Children&apos;s Privacy
            </h2>
            <p>
              Our services are not intended for children under the age of 16. We do not knowingly
              collect personal information from children under 16. If you are a parent or guardian
              and believe your child has provided us with personal information, please contact us,
              and we will delete such information.
            </p>
          </div>

          {/* Third-Party Links */}
          <div className="space-y-4 text-gray-300">
            <h2 className="text-2xl font-bold text-white">
              Third-Party Links and Services
            </h2>
            <p>
              Our platform may contain links to third-party websites, applications, or services that
              are not operated by us. We are not responsible for the privacy practices of these third
              parties. We encourage you to review their privacy policies before providing any personal
              information.
            </p>
          </div>

          {/* Changes */}
          <div className="space-y-4 text-gray-300">
            <h2 className="text-2xl font-bold text-white">
              Changes to This Privacy Policy
            </h2>
            <p>We may update this privacy policy and will notify you of material changes by:</p>
            <PolicyList items={[
              'Posting the updated policy on this page with a new "Last Updated" date',
              'Sending you an email notification (for significant changes)',
              'Displaying a prominent notice on our website',
            ]} />
            <p>
              Your continued use of our services after any changes indicates your acceptance of the
              updated privacy policy.
            </p>
          </div>

          {/* Contact */}
          <PolicySection icon={Mail} title="Contact Us">
            <p>
              If you have any questions, concerns, or requests regarding this privacy policy or our
              data practices, please contact us:
            </p>
            <PolicyCallout variant="subtle">
              <p>
                <strong className="text-white">Email:</strong>{' '}
                <a href="mailto:privacy@SamCard.com" className="text-theme-kelly-green hover:underline">
                  privacy@SamCard.com
                </a>
              </p>
              <p className="mt-2">
                <strong className="text-white">Data Protection Officer:</strong>{' '}
                <a href="mailto:dpo@SamCard.com" className="text-theme-kelly-green hover:underline">
                  dpo@SamCard.com
                </a>
              </p>
              <p className="mt-2">
                <strong className="text-white">Mailing Address:</strong><br />
                SamCard Inc.<br />
                123 Business Street, Suite 100<br />
                San Francisco, CA 94105<br />
                United States
              </p>
            </PolicyCallout>
          </PolicySection>

          {/* GDPR / CCPA */}
          <div
            className="p-6 rounded-xl space-y-6"
            style={{
              background: 'rgba(0, 180, 0, 0.08)',
              border: '1px solid rgba(0, 180, 0, 0.3)',
            }}
          >
            <h2 className="text-2xl font-bold text-white">
              Additional Information for EU and California Residents
            </h2>
            <div className="text-gray-300">
              <h3 className="text-lg font-semibold mb-2 text-white">
                EU Residents (GDPR)
              </h3>
              <p>
                If you are located in the European Economic Area, you have specific rights under the
                General Data Protection Regulation (GDPR), including the right to lodge a complaint
                with a supervisory authority.
              </p>
            </div>
            <div className="text-gray-300">
              <h3 className="text-lg font-semibold mb-2 text-white">
                California Residents (CCPA)
              </h3>
              <p>
                If you are a California resident, you have specific rights under the California
                Consumer Privacy Act (CCPA), including the right to know what personal information
                we collect and the right to opt-out of the sale of personal information (we do not
                sell personal information).
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}