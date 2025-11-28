"use client";

import { useState } from "react";
import {
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");

  const supportTickets = [
    {
      id: "TICKET001",
      subject: "Payment Issue",
      status: "Open",
      priority: "High",
      date: "2024-01-15",
      lastUpdate: "2 hours ago",
    },
    {
      id: "TICKET002",
      subject: "Account Verification",
      status: "Resolved",
      priority: "Medium",
      date: "2024-01-10",
      lastUpdate: "3 days ago",
    },
    {
      id: "TICKET003",
      subject: "Commission Rate Question",
      status: "In Progress",
      priority: "Low",
      date: "2024-01-12",
      lastUpdate: "1 day ago",
    },
  ];

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
      className="min-h-screen text-white w-full max-w-full overflow-x-hidden"
      style={{ backgroundColor: "#000000" }}
    >
      <div className="p-3 sm:p-4 lg:p-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 lg:mb-8">Support</h1>

        {/* Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <div
            className="rounded-lg p-4 sm:p-5 lg:p-6 text-center w-full min-w-0"
            style={{ backgroundColor: "#0C0C0C" }}
          >
            <ChatBubbleLeftRightIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 mx-auto mb-2 sm:mb-3 lg:mb-4" />
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Live Chat</h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 break-words">
              Get instant help from our support team
            </p>
            <button
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white font-medium text-xs sm:text-sm"
              style={{ backgroundColor: "#7C3AED" }}
            >
              Start Chat
            </button>
          </div>
          <div
            className="rounded-lg p-4 sm:p-5 lg:p-6 text-center w-full min-w-0"
            style={{ backgroundColor: "#0C0C0C" }}
          >
            <PhoneIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-400 mx-auto mb-2 sm:mb-3 lg:mb-4" />
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Phone Support</h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 break-words">
              Call us for urgent issues
            </p>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-green-400 break-words">
              +1 (555) 123-4567
            </p>
          </div>
          <div
            className="rounded-lg p-4 sm:p-5 lg:p-6 text-center w-full min-w-0"
            style={{ backgroundColor: "#0C0C0C" }}
          >
            <EnvelopeIcon className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400 mx-auto mb-2 sm:mb-3 lg:mb-4" />
            <h3 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">Email Support</h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4 break-words">
              Send us a detailed message
            </p>
            <p className="text-xs sm:text-sm text-purple-400 break-all">support@mutantschool.com</p>
          </div>
        </div>

        {/* Support Hours */}
        <div
          className="rounded-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8 w-full min-w-0"
          style={{ backgroundColor: "#0C0C0C" }}
        >
          <div className="flex items-center mb-2 sm:mb-3 lg:mb-4">
            <ClockIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 mr-2 sm:mr-3 flex-shrink-0" />
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold">Support Hours</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <h3 className="font-medium mb-1 sm:mb-2 text-sm sm:text-base break-words">Live Chat & Phone</h3>
              <p className="text-xs sm:text-sm text-gray-400 break-words">
                Monday - Friday: 9:00 AM - 6:00 PM EST
              </p>
              <p className="text-xs sm:text-sm text-gray-400 break-words">
                Saturday: 10:00 AM - 4:00 PM EST
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1 sm:mb-2 text-sm sm:text-base break-words">Email Support</h3>
              <p className="text-xs sm:text-sm text-gray-400 break-words">
                24/7 - Response within 24 hours
              </p>
            </div>
          </div>
        </div>

        {/* Create New Ticket */}
        <div
          className="rounded-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8 w-full min-w-0"
          style={{ backgroundColor: "#0C0C0C" }}
        >
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 lg:mb-6">Create Support Ticket</h2>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-white text-sm sm:text-base"
                style={{ backgroundColor: "#000000" }}
              >
                <option value="general">General Inquiry</option>
                <option value="payment">Payment Issue</option>
                <option value="technical">Technical Support</option>
                <option value="account">Account Issue</option>
                <option value="billing">Billing Question</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
                Subject
              </label>
              <input
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="Brief description of your issue"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-white text-sm sm:text-base"
                style={{ backgroundColor: "#000000" }}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm text-gray-400 mb-1 sm:mb-2">
                Message
              </label>
              <textarea
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Please provide detailed information about your issue"
                rows={5}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-white text-sm sm:text-base resize-y"
                style={{ backgroundColor: "#000000" }}
              />
            </div>
            <button
              className="px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-white font-medium text-xs sm:text-sm w-full sm:w-auto"
              style={{ backgroundColor: "#7C3AED" }}
            >
              Submit Ticket
            </button>
          </div>
        </div>

        {/* My Tickets */}
        <div
          className="rounded-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 lg:mb-8 w-full min-w-0"
          style={{ backgroundColor: "#0C0C0C" }}
        >
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 lg:mb-6">My Support Tickets</h2>
          <div className="space-y-3 sm:space-y-4">
            {supportTickets.map((ticket, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg"
                style={{ backgroundColor: "#000000" }}
              >
                <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0 w-full sm:w-auto">
                  <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
                    {ticket.status === "Resolved" ? (
                      <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                    ) : ticket.status === "Open" ? (
                      <ExclamationTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                    ) : (
                      <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                    )}
                    <span className="font-medium text-xs sm:text-sm">{ticket.id}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm sm:text-base break-words">{ticket.subject}</h3>
                    <p className="text-xs sm:text-sm text-gray-400 break-words">
                      Last update: {ticket.lastUpdate}
                    </p>
                  </div>
                </div>
                <div className="text-left sm:text-right flex-shrink-0 w-full sm:w-auto">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      ticket.status === "Resolved"
                        ? "bg-green-900 text-green-400"
                        : ticket.status === "Open"
                        ? "bg-red-900 text-red-400"
                        : "bg-yellow-900 text-yellow-400"
                    }`}
                  >
                    {ticket.status}
                  </span>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1">
                    {ticket.priority} Priority
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="rounded-lg p-3 sm:p-4 lg:p-6 w-full min-w-0" style={{ backgroundColor: "#0C0C0C" }}>
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-3 sm:mb-4 lg:mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {faqItems.map((faq, index) => (
              <div key={index} className="pb-3 sm:pb-4 border-b border-gray-800 last:border-b-0">
                <h3 className="font-medium mb-1 sm:mb-2 text-sm sm:text-base break-words">{faq.question}</h3>
                <p className="text-xs sm:text-sm text-gray-400 break-words leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
