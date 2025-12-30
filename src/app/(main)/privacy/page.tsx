export const metadata = {
  title: 'Privacy Policy | Foundation Exclusive',
  description: 'Privacy Policy for Foundation Exclusive - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="section-container">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="mt-4 text-foreground-muted">
            Last updated: January 1, 2025
          </p>

          <div className="mt-12 space-y-8 text-foreground-muted">
            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                1. Introduction
              </h2>
              <p className="mt-4">
                Foundation Exclusive (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to 
                protecting your privacy. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you visit our 
                website and use our NFT marketplace services.
              </p>
              <p className="mt-4">
                As an exclusive platform for high-value NFT collectors and creators, 
                we understand the importance of maintaining the confidentiality and 
                security of your personal and financial information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                2. Information We Collect
              </h2>
              <h3 className="mt-4 text-lg font-medium text-foreground">
                Personal Information
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-2">
                <li>Name and email address</li>
                <li>Wallet addresses associated with your account</li>
                <li>Profile information you choose to provide</li>
                <li>Transaction history and NFT ownership records</li>
                <li>Communication preferences</li>
              </ul>
              
              <h3 className="mt-4 text-lg font-medium text-foreground">
                Technical Information
              </h3>
              <ul className="mt-2 list-inside list-disc space-y-2">
                <li>IP address and device identifiers</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent on our platform</li>
                <li>Referring website addresses</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                3. How We Use Your Information
              </h2>
              <p className="mt-4">We use the information we collect to:</p>
              <ul className="mt-2 list-inside list-disc space-y-2">
                <li>Provide, operate, and maintain our marketplace services</li>
                <li>Process transactions and send related information</li>
                <li>Verify your identity and prevent fraud</li>
                <li>Send you updates about your account and transactions</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Improve our platform and develop new features</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                4. Information Sharing and Disclosure
              </h2>
              <p className="mt-4">
                We do not sell, trade, or rent your personal information to third 
                parties. We may share your information in the following circumstances:
              </p>
              <ul className="mt-2 list-inside list-disc space-y-2">
                <li>
                  <strong>Blockchain Transactions:</strong> NFT transactions are 
                  recorded on public blockchains and are visible to anyone.
                </li>
                <li>
                  <strong>Service Providers:</strong> We may share information with 
                  trusted third-party service providers who assist in operating our 
                  platform.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose information 
                  when required by law or to protect our rights.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                5. Data Security
              </h2>
              <p className="mt-4">
                We implement appropriate technical and organizational measures to 
                protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction. However, no method of 
                transmission over the Internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                6. Your Rights
              </h2>
              <p className="mt-4">You have the right to:</p>
              <ul className="mt-2 list-inside list-disc space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to or restrict processing of your information</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                7. Cookies and Tracking
              </h2>
              <p className="mt-4">
                We use cookies and similar tracking technologies to enhance your 
                experience on our platform. For more information, please see our{' '}
                <a href="/cookies" className="text-accent-primary hover:underline">
                  Cookie Policy
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                8. Changes to This Policy
              </h2>
              <p className="mt-4">
                We may update this Privacy Policy from time to time. We will notify 
                you of any changes by posting the new Privacy Policy on this page 
                and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground">
                9. Contact Us
              </h2>
              <p className="mt-4">
                If you have any questions about this Privacy Policy, please contact 
                us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong>{' '}
                <a
                  href="mailto:privacy@foundationexclusive.com"
                  className="text-accent-primary hover:underline"
                >
                  privacy@foundationexclusive.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}