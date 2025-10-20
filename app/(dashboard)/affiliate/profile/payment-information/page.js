"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PaymentInformationPage() {
  const pathname = usePathname();

  const [paymentInfo, setPaymentInfo] = useState({
    method: "bank",
    bankName: "First Bank of Nigeria",
    accountNumber: "1234567890",
    accountName: "Etieno Ekanem",
    swiftCode: "FBNINGLA",
    minimumPayout: "100",
    frequency: "bi-weekly",
  });

  const profileNavItems = [
    {
      name: "Personal Information",
      href: "/affiliate/profile/personal-information",
    },
    { name: "Notifications", href: "/affiliate/profile/notifications" },
    {
      name: "Payment Information",
      href: "/affiliate/profile/payment-information",
    },
    { name: "Security Settings", href: "/affiliate/profile/security-settings" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Profile Navigation */}
      <div className="w-full lg:w-64">
        <div className="rounded-lg p-4" style={{ backgroundColor: "#0F0F0F" }}>
          <nav className="space-y-2">
            {profileNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-purple-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Payment Information Content */}
      <div className="flex-1">
        <div className="rounded-lg p-6" style={{ backgroundColor: "#0F0F0F" }}>
          <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Payment Method
              </label>
              <select
                value={paymentInfo.method}
                onChange={(e) =>
                  setPaymentInfo({
                    ...paymentInfo,
                    method: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-lg text-white"
                style={{ backgroundColor: "#000000" }}
              >
                <option value="bank">Bank Transfer</option>
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={paymentInfo.bankName}
                  onChange={(e) =>
                    setPaymentInfo({
                      ...paymentInfo,
                      bankName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg text-white"
                  style={{ backgroundColor: "#000000" }}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={paymentInfo.accountNumber}
                  onChange={(e) =>
                    setPaymentInfo({
                      ...paymentInfo,
                      accountNumber: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg text-white"
                  style={{ backgroundColor: "#000000" }}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  value={paymentInfo.accountName}
                  onChange={(e) =>
                    setPaymentInfo({
                      ...paymentInfo,
                      accountName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg text-white"
                  style={{ backgroundColor: "#000000" }}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  SWIFT Code
                </label>
                <input
                  type="text"
                  value={paymentInfo.swiftCode}
                  onChange={(e) =>
                    setPaymentInfo({
                      ...paymentInfo,
                      swiftCode: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg text-white"
                  style={{ backgroundColor: "#000000" }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Minimum Payout
                </label>
                <input
                  type="text"
                  value={paymentInfo.minimumPayout}
                  onChange={(e) =>
                    setPaymentInfo({
                      ...paymentInfo,
                      minimumPayout: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg text-white"
                  style={{ backgroundColor: "#000000" }}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Payment Frequency
                </label>
                <select
                  value={paymentInfo.frequency}
                  onChange={(e) =>
                    setPaymentInfo({
                      ...paymentInfo,
                      frequency: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg  text-white"
                  style={{ backgroundColor: "#000000" }}
                >
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="px-6 py-3 rounded-lg text-white font-medium"
                style={{ backgroundColor: "#7C3AED" }}
              >
                Save Payment Information
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
