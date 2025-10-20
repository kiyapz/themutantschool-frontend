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
      className="min-h-screen text-white"
      style={{ backgroundColor: "#000000" }}
    >
      <div className="p-4 sm:p-6">
        <h1 className="text-2xl font-bold mb-8">Support</h1>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className="rounded-lg p-6 text-center"
            style={{ backgroundColor: "#0C0C0C" }}
          >
            <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-400 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-sm text-gray-400 mb-4">
              Get instant help from our support team
            </p>
            <button
              className="px-4 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: "#7C3AED" }}
            >
              Start Chat
            </button>
          </div>
          <div
            className="rounded-lg p-6 text-center"
            style={{ backgroundColor: "#0C0C0C" }}
          >
            <PhoneIcon className="h-8 w-8 text-green-400 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Phone Support</h3>
            <p className="text-sm text-gray-400 mb-4">
              Call us for urgent issues
            </p>
            <p className="text-lg font-bold text-green-400">
              +1 (555) 123-4567
            </p>
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Live Chat & Phone</h3>
              <p className="text-sm text-gray-400">
                Monday - Friday: 9:00 AM - 6:00 PM EST
              </p>
              <p className="text-sm text-gray-400">
                Saturday: 10:00 AM - 4:00 PM EST
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Email Support</h3>
              <p className="text-sm text-gray-400">
                24/7 - Response within 24 hours
              </p>
            </div>
          </div>
        </div>

        {/* Create New Ticket */}
        <div
          className="rounded-lg p-6 mb-8"
          style={{ backgroundColor: "#0C0C0C" }}
        >
          <h2 className="text-xl font-semibold mb-6">Create Support Ticket</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-white"
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
              <label className="block text-sm text-gray-400 mb-2">
                Subject
              </label>
              <input
                type="text"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="Brief description of your issue"
                className="w-full px-4 py-3 rounded-lg text-white"
                style={{ backgroundColor: "#000000" }}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Message
              </label>
              <textarea
                value={ticketMessage}
                onChange={(e) => setTicketMessage(e.target.value)}
                placeholder="Please provide detailed information about your issue"
                rows={6}
                className="w-full px-4 py-3 rounded-lg text-white"
                style={{ backgroundColor: "#000000" }}
              />
            </div>
            <button
              className="px-6 py-3 rounded-lg text-white font-medium"
              style={{ backgroundColor: "#7C3AED" }}
            >
              Submit Ticket
            </button>
          </div>
        </div>

        {/* My Tickets */}
        <div
          className="rounded-lg p-6 mb-8"
          style={{ backgroundColor: "#0C0C0C" }}
        >
          <h2 className="text-xl font-semibold mb-6">My Support Tickets</h2>
          <div className="space-y-4">
            {supportTickets.map((ticket, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg"
                style={{ backgroundColor: "#000000" }}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {ticket.status === "Resolved" ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-400" />
                    ) : ticket.status === "Open" ? (
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                    ) : (
                      <ClockIcon className="h-5 w-5 text-yellow-400" />
                    )}
                    <span className="font-medium">{ticket.id}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{ticket.subject}</h3>
                    <p className="text-sm text-gray-400">
                      Last update: {ticket.lastUpdate}
                    </p>
                  </div>
                </div>
                <div className="text-right">
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
                  <p className="text-sm text-gray-400 mt-1">
                    {ticket.priority} Priority
                  </p>
                </div>
              </div>
            ))}
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
