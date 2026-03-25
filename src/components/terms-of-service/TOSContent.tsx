import { ToSSection } from './TOSSec';
import { ToSList } from './TOSList';
import { ToSCallout } from './TOSCallout';

import {
  FileText, AlertTriangle, Zap, Users, Scale, TriangleAlert, DoorOpen,
} from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen text-white bg-black">
      <section className="py-16 px-8 lg:px-12 bg-black">
        <div className="max-w-3xl mx-auto space-y-12">

          <p className="text-gray-300" style={{ lineHeight: 1.8 }}>
            These Terms of Service (&quot;Terms&quot;) govern your use of SamCard&apos;s website, mobile applications,
            and services. By accessing or using SamCard, you agree to be bound by these Terms. If you do not
            agree to these Terms, please do not use our services.
          </p>

          <ToSSection id="definitions" icon={FileText} title="Definitions and Interpretation">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Key Terms</h3>
              <ToSList items={[
                { label: 'Company/We/Us', text: 'SamCard Inc. and its affiliates' },
                { label: 'Service', text: 'Our digital business card platform and related services' },
                { label: 'User/You', text: 'Any individual or entity accessing or using our Service' },
                { label: 'Content', text: 'Any data, text, images, or information provided by users' },
                { label: 'Agreement', text: 'These Terms of Service and all referenced policies' },
              ]} />
            </div>
          </ToSSection>

          <ToSSection id="use-license" icon={Zap} title="License and Use Rights">
            <p>We grant you a limited, non-exclusive, non-transferable license to use our Service subject to these Terms.</p>
            <h3 className="text-lg font-semibold mb-3 mt-4 text-white">You agree NOT to:</h3>
            <ToSList items={[
              'Violate any laws or regulations in your jurisdiction',
              'Use the Service for any illegal or unauthorized purpose',
              'Transmit spam, malware, viruses, or any harmful code',
              'Harass, threaten, or abuse other users',
              'Attempt to gain unauthorized access to our systems',
              'Reverse engineer, decompile, or disassemble our Service',
              'Remove or alter any proprietary notices or labels',
              'Scrape, crawl, or extract data without authorization',
            ]} />
          </ToSSection>

          <ToSSection id="user-accounts" icon={Users} title="User Accounts and Responsibilities">
            <p>When you create an account with SamCard, you are responsible for maintaining the confidentiality of your login credentials.</p>
            <h3 className="text-lg font-semibold mb-3 mt-4 text-white">Your Responsibilities:</h3>
            <ToSList items={[
              { label: 'Accurate Information', text: 'You agree to provide accurate, current, and complete information during registration' },
              { label: 'Security', text: 'You are responsible for all activity under your account and must notify us of unauthorized access' },
              { label: 'Age', text: 'You confirm that you are at least 16 years of age and have the legal authority to enter into this Agreement' },
              { label: 'Usage', text: 'You agree to use the Service only for purposes consistent with these Terms' },
            ]} />
            <ToSCallout variant="warning">
              <strong className="text-white">Important:</strong> We are not liable for any loss or damage arising from your failure to protect your account credentials.
            </ToSCallout>
          </ToSSection>

          <ToSSection id="intellectual-property" icon={Scale} title="Intellectual Property Rights">
            <p>
              The Service, including all content, features, and functionality, is owned by SamCard, our licensors,
              or other providers of such content and is protected by copyright, trademark, and other intellectual property laws.
            </p>
            <h3 className="text-lg font-semibold mb-3 mt-4 text-white">Your Content:</h3>
            <ToSList items={[
              { label: 'Ownership', text: 'You retain all rights to any content you create and upload to your digital business card' },
              { label: 'License', text: 'By uploading content, you grant SamCard a worldwide, royalty-free license to use, reproduce, and display your content for service purposes' },
              { label: 'Responsibility', text: 'You are responsible for ensuring your content does not infringe on third-party rights' },
              { label: 'Removal', text: 'We may remove content that violates these Terms or applicable laws' },
            ]} />
          </ToSSection>

          <ToSSection id="content-conduct" icon={AlertTriangle} title="User Content and Prohibited Conduct">
            <p>You are solely responsible for any content you create, upload, or distribute through the Service.</p>
            <h3 className="text-lg font-semibold mb-3 mt-4 text-white">Prohibited Content:</h3>
            <ToSList items={[
              'Content that is defamatory, obscene, or offensive',
              'Content that violates intellectual property rights',
              'Content containing personal information of others without consent',
              'Content promoting violence, discrimination, or illegal activities',
              'Spam, advertising, or commercial solicitation',
              'Content containing viruses or malicious code',
            ]} />
            <p className="mt-4">Violation of these provisions may result in immediate suspension or termination of your account.</p>
          </ToSSection>

          <ToSSection id="fees-payment" icon={Zap} title="Fees and Payment Terms">
            <p>Some features of our Service may require payment. All fees are exclusive of applicable taxes.</p>
            <h3 className="text-lg font-semibold mb-3 mt-4 text-white">Payment Terms:</h3>
            <ToSList items={[
              { label: 'Billing', text: 'Fees will be billed in accordance with the pricing plan you select' },
              { label: 'Recurring Charges', text: 'Subscription plans will automatically renew unless cancelled before the renewal date' },
              { label: 'Refunds', text: 'Except where required by law, payments are non-refundable' },
              { label: 'Taxes', text: 'You are responsible for any applicable sales, VAT, or other taxes' },
              { label: 'Price Changes', text: 'We reserve the right to change pricing with 30 days notice' },
            ]} />
            <ToSCallout variant="info">
              <p>We use industry-standard payment processors to securely handle all transactions. Your payment information is encrypted and never stored on our servers.</p>
            </ToSCallout>
          </ToSSection>

          <ToSSection id="liability" icon={TriangleAlert} title="Limitation of Liability">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SAMCARD SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.
            </p>
            <h3 className="text-lg font-semibold mb-3 mt-4 text-white">This includes liability for:</h3>
            <ToSList items={[
              'Loss of profits, revenue, or business opportunities',
              'Loss of data or information',
              'Service interruptions or errors',
              'Damage to your devices or systems',
              'Third-party claims or actions',
            ]} />
            <p className="mt-4">Our total liability under these Terms shall not exceed the amount you paid us in the 12 months preceding the claim.</p>
          </ToSSection>

          <div className="space-y-4 text-gray-300">
            <h2 className="text-2xl font-bold text-white">Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS
              OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
            <p>We do not warrant that the Service will be uninterrupted, error-free, or free of viruses or harmful components.</p>
          </div>

          <div className="space-y-4 text-gray-300">
            <h2 className="text-2xl font-bold text-white">Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless SamCard, its officers, directors, employees, and agents from
              any claims, damages, losses, or expenses (including attorney fees) arising from:
            </p>
            <ToSList items={[
              'Your violation of these Terms',
              'Your use of the Service in violation of law',
              'Your Content or any information you provide',
              'Your infringement of third-party rights',
            ]} />
          </div>

          <ToSSection id="termination" icon={DoorOpen} title="Termination">
            <p>
              We may suspend or terminate your account and access to the Service at any time, with or without cause,
              and with or without notice.
            </p>
            <h3 className="text-lg font-semibold mb-3 mt-4 text-white">Reasons for Termination:</h3>
            <ToSList items={[
              'Violation of these Terms',
              'Engaging in illegal activities',
              'Nonpayment of fees',
              'Abusive or harassing behavior',
              'Extended period of inactivity',
            ]} />
            <h3 className="text-lg font-semibold mb-3 mt-4 text-white">Upon Termination:</h3>
            <ToSList items={[
              'Your account access will be immediately disabled',
              'Content may be deleted after 30 days unless otherwise required',
              'Fees paid are non-refundable',
              'Our liability ceases except for accumulated rights',
            ]} />
          </ToSSection>

          <div className="space-y-4 text-gray-300">
            <h2 className="text-2xl font-bold text-white">Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Material changes will be communicated via email or
              prominent notice on our website. Your continued use of the Service after changes indicates your acceptance.
            </p>
          </div>

          <div id="disputes" className="space-y-4 text-gray-300">
            <h2 className="text-2xl font-bold text-white">Dispute Resolution</h2>
            <p>
              Any dispute arising under these Terms shall be governed by the laws of California, United States,
              without regard to conflict of law principles.
            </p>
            <h3 className="text-lg font-semibold mb-3 mt-4 text-white">Resolution Process:</h3>
            <ToSList items={[
              { label: 'Informal Resolution', text: 'Contact our legal team to attempt good faith negotiation' },
              { label: 'Binding Arbitration', text: 'Disputes shall be resolved through binding arbitration administered by the American Arbitration Association' },
              { label: 'Exceptions', text: 'Claims for injunctive relief may be brought in court to prevent irreparable harm' },
              { label: 'Location', text: 'Arbitration shall take place in San Francisco, California' },
            ]} />
            <ToSCallout variant="warning">
              <p>
                <strong className="text-white">Class Action Waiver:</strong> You agree that any arbitration shall be conducted on an individual basis and not as a class action.
              </p>
            </ToSCallout>
          </div>

          <div className="space-y-4 text-gray-300">
            <h2 className="text-2xl font-bold text-white">Third-Party Services and Links</h2>
            <p>
              Our Service may contain links to third-party websites and services. We are not responsible for the content,
              accuracy, or practices of these third parties. Your use of third-party services is at your own risk and
              subject to their terms and conditions.
            </p>
          </div>

          <ToSSection id="contact" icon={FileText} title="Contact Information">
            <p>If you have questions about these Terms, please contact us:</p>
            <ToSCallout variant="info">
              <p>
                <strong className="text-white">Email:</strong>{' '}
                <a href="mailto:legal@SamCard.com" className="text-theme-kelly-green hover:underline">
                  legal@SamCard.com
                </a>
              </p>
              <p className="mt-2">
                <strong className="text-white">Mailing Address:</strong><br />
                SamCard Inc.<br />
                123 Business Street, Suite 100<br />
                San Francisco, CA 94105<br />
                United States
              </p>
            </ToSCallout>
          </ToSSection>

          <div
            className="p-6 rounded-lg space-y-4 bg-theme-devil-green/20 border border-theme-kelly-green"
          >
            <h2 className="text-2xl font-bold text-white">Effective Date</h2>
            <p className="text-gray-300">
              These Terms of Service were last updated on <strong>March 9, 2026</strong> and are effective immediately.
              By using SamCard after this date, you are deemed to have accepted these Terms.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}