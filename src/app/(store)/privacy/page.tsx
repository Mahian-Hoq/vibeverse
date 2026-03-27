export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600">
            Last updated: March 28, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none space-y-8 text-gray-700">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p>
              VibeVerse ("we," "us," or "our") operates the website and e-commerce platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and make purchases.
            </p>
            <p>
              Please read this Privacy Policy carefully. If you do not agree with our policies and practices, please do not use our services. By accessing and using VibeVerse, you acknowledge that you have read, understood, and agree to be bound by all the provisions of this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            <p>We collect information in various ways, including:</p>
            <ul className="list-disc list-inside space-y-2 my-4">
              <li><strong>Personal Information:</strong> Name, email address, postal address, phone number, and payment information when you create an account or make a purchase.</li>
              <li><strong>Account Information:</strong> Login credentials, account preferences, order history, and communication preferences.</li>
              <li><strong>Transaction Information:</strong> Details about purchases, including items ordered, quantities, prices, and delivery addresses.</li>
              <li><strong>Website Usage Data:</strong> Information about your browsing activities, pages visited, links clicked, and search queries.</li>
              <li><strong>Technical Information:</strong> IP address, browser type, operating system, device identifiers, and cookie data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-2 my-4">
              <li>Process and fulfill your orders and transactions</li>
              <li>Send order confirmations, shipping updates, and delivery notifications</li>
              <li>Provide customer support and respond to your inquiries</li>
              <li>Create and manage your account</li>
              <li>Personalize your shopping experience</li>
              <li>Send marketing communications and promotional offers (with your consent)</li>
              <li>Improve our website, products, and services</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing and Disclosure</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. However, we may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 my-4">
              <li><strong>Service Providers:</strong> With vendors who assist us in operating our website, processing payments, and fulfilling orders, under strict confidentiality agreements.</li>
              <li><strong>Shipping Partners:</strong> We share your delivery address with logistics and shipping partners necessary to deliver your orders.</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government request.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or business closure, your information may be transferred as part of that transaction.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Security of Your Information</h2>
            <p>
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking Technologies</h2>
            <p>
              Our website uses cookies and similar tracking technologies to enhance your browsing experience, remember your preferences, and analyze website traffic. You can control cookie settings through your browser, but disabling cookies may affect website functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, including the right to access, update, or delete your information. To exercise these rights or submit a data request, please contact us at mrdot1429@gmail.com.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy practices of external sites. Please review their privacy policies before providing personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p>
              VibeVerse is not intended for children under 13 years old. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal information, we will promptly delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="bg-gray-100 p-6 rounded-lg mt-4">
              <p><strong>Email:</strong> mrdot1429@gmail.com</p>
              <p><strong>WhatsApp:</strong> +880 1759 755 408</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
