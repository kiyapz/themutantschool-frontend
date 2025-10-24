"use client";
import Link from "next/link";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8">
      <div className="max-w-3xl w-full">
        {/* Cancel Icon */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-[#FFA500] to-[#FF8C00] flex items-center justify-center shadow-lg">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="font-[400] text-[28px] sm:text-[38px] md:text-[45px] leading-[36px] sm:leading-[46px] md:leading-[55px] Xirod text-[#FFA500] mb-2 sm:mb-3 px-2">
            PAYMENT CANCELLED
          </h1>
          <p className="text-[var(--text)] text-[15px] sm:text-[17px] md:text-[18px] leading-[24px] sm:leading-[26px] md:leading-[28px] font-[400] max-w-xl mx-auto px-2">
            No charges were made. Your cart has been saved and is ready when you
            are.
          </p>
        </div>

        {/* Information Card */}
        <div className="bg-[var(--accent)] rounded-[12px] sm:rounded-[15px] p-5 sm:p-6 md:p-8 mb-6 sm:mb-8 border border-[#FFA500]/30">
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="text-xl sm:text-2xl mt-0.5 sm:mt-1 flex-shrink-0">
                💳
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-[700] text-[16px] sm:text-[17px] md:text-[18px] text-[var(--background)] mb-1 sm:mb-2">
                  No Charges Made
                </h3>
                <p className="text-[var(--text)] text-[13px] sm:text-[14px] leading-[20px] sm:leading-[22px]">
                  Your payment method was not charged. You can complete your
                  purchase whenever you're ready.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="text-xl sm:text-2xl mt-0.5 sm:mt-1 flex-shrink-0">
                🛒
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-[700] text-[16px] sm:text-[17px] md:text-[18px] text-[var(--background)] mb-1 sm:mb-2">
                  Cart Saved
                </h3>
                <p className="text-[var(--text)] text-[13px] sm:text-[14px] leading-[20px] sm:leading-[22px]">
                  All items remain in your cart. Your selections are safe and
                  waiting for you.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 sm:gap-4">
              <div className="text-xl sm:text-2xl mt-0.5 sm:mt-1 flex-shrink-0">
                💰
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-[700] text-[16px] sm:text-[17px] md:text-[18px] text-[var(--background)] mb-1 sm:mb-2">
                  Try Again Anytime
                </h3>
                <p className="text-[var(--text)] text-[13px] sm:text-[14px] leading-[20px] sm:leading-[22px]">
                  You can return to your cart and complete checkout whenever
                  it's convenient.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Link
            href="/cart"
            className="w-full sm:w-auto sm:min-w-[200px] h-[54px] sm:h-[60px] flex items-center justify-center btn font-[700] text-[16px] sm:text-[18px] rounded-[10px] hover:opacity-90 active:opacity-80 transition-opacity"
          >
            Return to Cart
          </Link>
          <Link
            href="/missions"
            className="w-full sm:w-auto sm:min-w-[200px] h-[54px] sm:h-[60px] flex items-center justify-center bg-[var(--accent)] text-[var(--background)] font-[700] text-[16px] sm:text-[18px] rounded-[10px] hover:opacity-90 active:opacity-80 transition-opacity border border-[#844CDC]/30"
          >
            Explore Missions
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-6 sm:mt-8 px-2">
          <div className="bg-[var(--accent)] rounded-[10px] px-4 sm:px-6 py-4 border border-[#844CDC]/20">
            <p className="text-[var(--text)] text-[13px] sm:text-[14px] leading-[20px] sm:leading-[22px] text-center">
              <span className="font-[600]">Need help with checkout?</span>
              <br />
              <Link
                href="/support"
                className="text-[#844CDC] hover:underline active:text-[#6a3ab0] font-[600]"
              >
                Contact our support team
              </Link>{" "}
              and we'll assist you.
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-5 sm:mt-6 text-center flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-2">
          <Link
            href="/"
            className="text-[var(--text)] text-[13px] sm:text-[14px] hover:text-[#844CDC] active:text-[#6a3ab0] transition-colors"
          >
            Home
          </Link>
          <span className="text-[var(--text)] text-[13px] sm:text-[14px]">
            •
          </span>
          <Link
            href="/missions"
            className="text-[var(--text)] text-[13px] sm:text-[14px] hover:text-[#844CDC] active:text-[#6a3ab0] transition-colors"
          >
            Browse Missions
          </Link>
          <span className="text-[var(--text)] text-[13px] sm:text-[14px]">
            •
          </span>
          <Link
            href="/support"
            className="text-[var(--text)] text-[13px] sm:text-[14px] hover:text-[#844CDC] active:text-[#6a3ab0] transition-colors"
          >
            Support
          </Link>
        </div>
      </div>
    </div>
  );
}
