"use client";

import {
  EnvelopeIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function SupportPage() {

  const faqItems = [
    {
      question: "How do I track my referrals?",
      answer:
        "You can track your referrals in the Conversion History section of your dashboard. All successful conversions will be listed there with details about the user and commission earned.",
    },
    {
      question: "When do I receive payments?",
      answer:
        "Payments are processed bi-weekly on the 1st and 15th of each month. You can check your payment schedule in the Payments section.",
    },
    {
      question: "What is the commission rate?",
      answer:
        "Commission rates vary by program and can range from 10% to 30%. Your specific rate is displayed in your Profile settings.",
    },
    {
      question: "How do I update my payment information?",
      answer:
        "You can update your payment information in the Settings section under Payment Settings. Make sure to verify your details before saving.",
    },
  ];

  return (
    <div
      className="min-h-screen text-white"
      style={{ backgroundColor: "#000000" }}
    >
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-8">Support</h1>

        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-6 mb-8 max-w-md">
          <div
            className="rounded-lg p-6 text-center"
            style={{ backgroundColor: "#0C0C0C" }}
          >
            <EnvelopeIcon className="h-8 w-8 text-purple-400 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Email Support</h3>
            <p className="text-sm text-gray-400 mb-4">
              Send us a detailed message
            </p>
            <p className="text-sm text-purple-400">support@mutantschool.com</p>
          </div>
        </div>

        {/* Support Hours */}
        <div
          className="rounded-lg p-6 mb-8"
          style={{ backgroundColor: "#0C0C0C" }}
        >
          <div className="flex items-center mb-4">
            <ClockIcon className="h-6 w-6 text-yellow-400 mr-3" />
            <h2 className="text-xl font-semibold">Support Hours</h2>
          </div>
          <div>
            <h3 className="font-medium mb-2">Email Support</h3>
            <p className="text-sm text-gray-400">
              24/7 - Response within 24 hours
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="rounded-lg p-6" style={{ backgroundColor: "#0C0C0C" }}>
          <h2 className="text-xl font-semibold mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div key={index} className=" pb-4">
                <h3 className="font-medium mb-2">{faq.question}</h3>
                <p className="text-sm text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
