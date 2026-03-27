import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), mobile banking solutions, and other secure payment methods. All transactions are encrypted and processed securely.',
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-5 business days for orders within urban areas and 5-7 business days for other regions. Expedited shipping options are available at checkout for faster delivery.',
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 14-day return policy for most items in their original condition. Products must be unworn, unused, and have all original tags and packaging. To initiate a return, please contact our support team via email or WhatsApp.',
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Currently, we ship within the country. International shipping options are coming soon. Follow us on social media for updates on expanded shipping regions.',
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can use this number to track your package in real-time through our shipping partner\'s website.',
    },
    {
      question: 'Are your products authentic?',
      answer: 'Yes, we source all products directly from authorized manufacturers and verified wholesale partners. Every item is inspected for quality and authenticity before shipment.',
    },
    {
      question: 'Do you have a loyalty or rewards program?',
      answer: 'We\'re currently developing a rewards program for our customers. Sign up for our newsletter to be notified when it launches and to receive exclusive discounts and early access to new collections.',
    },
    {
      question: 'What if my product arrives damaged?',
      answer: 'If your item arrives damaged, please contact us immediately with photos of the damage. We\'ll either send a replacement or process a refund at no cost to you. We take product quality seriously.',
    },
    {
      question: 'How do I care for my accessories?',
      answer: 'Care instructions vary by product type. Check the product page or packaging for specific care guidelines. Generally, store jewelry in a dry place, clean with a soft cloth, and avoid prolonged water exposure.',
    },
    {
      question: 'Can I cancel or modify my order?',
      answer: 'Orders can be cancelled or modified within 2 hours of placement. Contact us immediately via email or WhatsApp with your order number. After 2 hours, your order enters our fulfillment process.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about VibeVerse orders, shipping, and products.
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
            >
              <summary className="flex items-center justify-between font-semibold text-gray-900 list-none">
                <span className="text-lg">{faq.question}</span>
                <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform duration-200" />
              </summary>
              <p className="text-gray-600 mt-4 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg border border-pink-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Get in touch with our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://wa.me/8801759755408"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Chat on WhatsApp
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=mrdot1429@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
