"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { FaTrash } from "react-icons/fa";

export default function ShoppingCart({
  items = [],
  onApplyCoupon,
  onCheckout,
  onRemove,
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
        // style={{ marginTop: "150px" }}
        className="max-w-[1200px] mx-auto min-h-[60vh]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          <div className="flex flex-col gap-4">
            <div className="text-white/90  text-[14px]">
              Shopping Cart ({items.length})
            </div>
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-[var(--card)] sm:h-[233px] border border-[#6E5B8D] rounded-[20px] overflow-hidden flex flex-col gap-4 relative"
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
                  <div
                    className="text-red-500 absolute top-5 right-5 cursor-pointer    "
                    onClick={() => onRemove?.(item.id)}
                    aria-label="Remove from cart"
                    role="button"
                  >
                    <FaTrash />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{ padding: "20px" }}
            className="bg-[#0E0E0E]  rounded-[20px] p-4 h-fit flex flex-col gap-10 self-start"
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
                <span className="text-[#78AD89] text-[16px] leading-[24px] sm:text-[22px] sm:leading-[32px] font-[700] ">
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
                Apply Coupon
              </div>
              <div className="flex ">
                <input
                  style={{ padding: "10px" }}
                  placeholder="Enter coupon code"
                  className="flex-1 bg-transparent border border-white/15 rounded-l-md px-3 py-2 text-white text-[12px] outline-none"
                />
                <button
                  style={{ padding: "10px" }}
                  onClick={() => onApplyCoupon?.()}
                  className="px-4 py-2 cursor-pointer rounded-r-md bg-[#844CDC] text-white text-[12px]"
                >
                  Apply
                </button>
              </div>
            </div>

            <button
              style={{ padding: "10px" }}
              onClick={() => onCheckout?.()}
              className="w-full mt-5 py-3 rounded-md bg-[#844CDC] text-white font-semibold text-[12px]"
            >
              Proceed to checkout
            </button>

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
