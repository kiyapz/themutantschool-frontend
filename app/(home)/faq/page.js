"use client";

import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is The Mutant School?",
      answer:
        "The Mutant School is an online learning platform that offers courses and missions to help you develop new skills and transform your career. We provide high-quality educational content across various fields including programming, design, marketing, and more.",
    },
    {
      question: "How do I enroll in a course?",
      answer:
        "To enroll in a course, simply browse our mission catalog, select a course that interests you, and click 'Enter Mission' or 'Add to Cart'. You can purchase individual courses or explore our course bundles.",
    },
    {
      question: "Do I get lifetime access to courses?",
      answer:
        "Yes! Once you purchase a course, you get lifetime access to all course materials, including future updates. You can learn at your own pace and revisit the content anytime.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, and PayPal. All payments are processed securely through our payment partners.",
    },
    {
      question: "Can I get a refund?",
      answer:
        "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with your purchase, you can request a full refund within 30 days. Please see our Refund Policy for more details.",
    },
    {
      question: "Are there any prerequisites for courses?",
      answer:
        "Most courses are designed to be beginner-friendly, but some advanced courses may have prerequisites. Check the course description for specific requirements.",
    },
    {
      question: "Do I receive a certificate upon completion?",
      answer:
        "Yes! Upon successful completion of a course, you'll receive a certificate of completion that you can share on your LinkedIn profile or resume.",
    },
    {
      question: "How do I access my courses?",
      answer:
        "After purchasing a course, you can access it immediately from your dashboard. Simply log in to your account and navigate to 'My Missions' to see all your enrolled courses.",
    },
    {
      question: "Can I download course materials?",
      answer:
        "Course materials are available for online viewing. Some courses may offer downloadable resources, which will be indicated in the course description.",
    },
    {
      question: "What if I need help during a course?",
      answer:
        "We offer multiple support channels including email support, community forums, and in some cases, direct instructor support. Check the course page for available support options.",
    },
    {
      question: "Are courses updated regularly?",
      answer:
        "Yes, we regularly update our courses to ensure they reflect the latest industry standards and best practices. As a student, you'll have access to all updates at no additional cost.",
    },
    {
      question: "Can I gift a course to someone?",
      answer:
        "Yes! You can purchase a course as a gift. During checkout, you'll have the option to gift the course to another person by entering their email address.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-center">
          Frequently Asked Questions
        </h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-800 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-900 transition-colors"
              >
                <span className="font-semibold text-lg">{faq.question}</span>
                <span className="text-2xl text-gray-400">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-900 text-gray-300">
                  <p className="leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            Still have questions? We're here to help!
          </p>
          <a
            href="mailto:support@themutantschool.com"
            className="text-[#EB8AF2] hover:text-[#C314FF] transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
