"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { FaTrash } from "react-icons/fa";

export default function ShoppingCart({
  items = [],
  onCheckout,
  onRemove,
  isGuest = false,
  guestEmail = "",
  onGuestEmailChange,
  onGuestEmailSubmit,
  emailInputValue = "",
  emailError = null,
  isProcessing = false,
  deletingItemId = null,
  couponCode = "",
  onCouponCodeChange,
}) {
  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => {
      const price =
        typeof item.price === "number" ? item.price : Number(item.price) || 0;
      return sum + price;
    }, 0);
    return { subtotal, discount: 0, total: subtotal };
  }, [items]);

  return (
    <div className="w-full px py-6">
      <div
        style={{ margin: "auto", marginTop: "150px" }}
        className="max-w-[1200px] h-full "
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <div className="flex flex-col gap-4">
            <div className="text-white/90  text-[14px]">
              Shopping Cart ({items.length})
            </div>
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-[var(--card)] sm:h-[233px] border border-[var(--purple-border)] rounded-[20px] overflow-hidden flex flex-col gap-4 relative"
              >
                <div
                  style={{ padding: "20px" }}
                  className="flex flex-col sm:flex-row items-stretch gap-4 h-full"
                >
                  <div className="relative w-full sm:w-[180px] h-[160px] sm:h-full">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={String(item.title || "Item")}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 p-2 sm:p-4 self-center ">
                    <div className="text-white font-[700] text-[18px] leading-[24px] sm:text-[26px] sm:leading-[32px] ">
                      {String(item.title || "Item")}
                    </div>
                    <div className="text-[#767676] text-[13px] sm:text-[19px] mt-1 font-[400] leading-[20px] sm:leading-[32px]   ">
                      By{" "}
                      {typeof item.by === "object"
                        ? "The Mutant School"
                        : item.by || "The Mutant School"}
                    </div>
                  </div>
                  <div className="p-2 sm:p-4 text-white text-[13px] sm:text-[16px] self-center">
                    $
                    {(() => {
                      const price =
                        typeof item.price === "number"
                          ? item.price
                          : Number(item.price) || 0;
                      return price.toFixed(2);
                    })()}
                  </div>
                  <div className="absolute top-5 right-5 flex items-center gap-2">
                    {deletingItemId === item.id ? (
                      <span className="text-white/70 text-xs sm:text-sm">
                        Deleting...
                      </span>
                    ) : (
                      <div
                        className="text-red-500 cursor-pointer hover:text-red-400 transition-colors"
                        onClick={() => onRemove?.(item.id)}
                        aria-label="Remove from cart"
                        role="button"
                      >
                        <FaTrash />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{ padding: "20px" }}
            className="bg-[var(--bg-very-dark)]  rounded-[20px] p-4 h-fit flex flex-col gap-10 self-start"
          >
            <div className="text-white font-semibold mb-4 text-[18px] leading-[24px] sm:text-[22px] sm:leading-[32px] font-[800] ">
              Order Summary
            </div>
            <div className="space-y-3 text-[13px] sm:text-[16px] text-white/80 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[16px] leading-[24px] sm:text-[22px] sm:leading-[32px] font-[800] ">
                  Subtotal
                </span>
                <span className="text-[16px] leading-[24px] sm:text-[22px] sm:leading-[32px] font-[700] ">
                  ${totals.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[16px] leading-[24px] sm:text-[22px] sm:leading-[32px]  font-[800] ">
                  Discount
                </span>
                <span className="text-[var(--success-soft)] text-[16px] leading-[24px] sm:text-[22px] sm:leading-[32px] font-[700] ">
                  -$0.00
                </span>
              </div>
              <div
                style={{ margin: "10px 0px" }}
                className="h-px bg-white/10"
              />
              <div className="flex items-center justify-between text-white">
                <span className="text-[16px] leading-[24px] sm:text-[22px] sm:leading-[32px] text-[#844CDC] font-[800]">
                  Total
                </span>
                <span className="text-[16px] sm:text-[22px]">
                  ${totals.total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2">
              <div className="text-white/70 text-[12px] sm:text-[22px] mb-2 leading-[18px] sm:leading-[32px] font-[800] ">
                Coupon Code
              </div>
              <input
                style={{ padding: "10px" }}
                placeholder="Enter coupon code (optional)"
                value={couponCode}
                onChange={(e) => onCouponCodeChange?.(e.target.value)}
                className="w-full bg-transparent border border-white/15 rounded-md px-3 py-2 text-white text-[12px] outline-none focus:border-[#844CDC]"
              />
              {couponCode && (
                <div className="text-xs text-white/60 mt-1">
                  Coupon will be applied at checkout
                </div>
              )}
            </div>

            {/* Guest checkout notice and form */}
            {isGuest && (
              <>
                <div className="mb-3 mt-2 flex items-center gap-2 p-2 bg-[#1a1632] rounded border border-[#844CDC]/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-[#844CDC]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs text-white/80">
                    You're checking out as a guest. No account required.
                  </span>
                </div>

                {/* Guest email form */}
                {!guestEmail && (
                  <div className="mb-4 mt-3 p-3 bg-[#1A1A1A] rounded border border-[#844CDC]/30">
                    <div className="text-white text-sm font-semibold mb-2">
                      Enter your email to proceed
                    </div>

                    <form onSubmit={onGuestEmailSubmit} className="space-y-3">
                      <input
                        type="email"
                        value={emailInputValue}
                        onChange={(e) => onGuestEmailChange?.(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full p-3 bg-[#232323] text-white rounded border border-gray-700 focus:border-[#844CDC] focus:outline-none"
                        required
                      />

                      {emailError && (
                        <div className="text-red-500 text-xs">{emailError}</div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-2 bg-[#844CDC] text-white text-sm rounded hover:bg-[#6a3ab0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          !emailInputValue ||
                          !emailInputValue.includes("@") ||
                          !emailInputValue.includes(".") ||
                          isProcessing
                        }
                      >
                        {isProcessing
                          ? "Processing..."
                          : "Continue to Checkout"}
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}

            {/* Show main checkout button only for logged-in users or guests who have provided an email */}
            {(!isGuest || guestEmail) && (
              <button
                style={{ padding: "10px" }}
                onClick={() => onCheckout?.()}
                className={`w-full mt-2 py-3 rounded-md bg-[var(--primary-light)] text-white font-semibold text-[12px] disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Proceed to checkout"}
              </button>
            )}

            <div className="text-center text-white/50 text-[10px] mt-3">
              14-Day Money-Back Guarantee
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8 text-white/70 text-[12px]">
          <Link href="/missions" className="hover:text-white">
            Continue Shopping
          </Link>
          <div className="opacity-70">Secure checkout</div>
        </div>
      </div>
    </div>
  );
}
