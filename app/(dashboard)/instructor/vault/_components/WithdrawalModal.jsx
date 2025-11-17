"use client";
import { useState, useCallback } from "react";
import profilebase from "../../profile/_components/profilebase";

export default function WithdrawalModal({ isOpen, onClose, onSuccess, availableBalance }) {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleWithdraw = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount.");
      setIsLoading(false);
      return;
    }

    if (parseFloat(amount) > availableBalance) {
        setError("Withdrawal amount cannot exceed available balance.");
        setIsLoading(false);
        return;
    }

    try {
      const accessToken = localStorage.getItem("login-accessToken");
      if (!accessToken) {
        throw new Error("No access token available");
      }

      const response = await profilebase.post(
        "withdrawal",
        { amount: parseFloat(amount) },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        onSuccess("Withdrawal request submitted successfully!");
        setAmount("");
        onClose();
      } else {
        throw new Error(response.data.message || "Failed to submit withdrawal request.");
      }
    } catch (err) {
      console.error("Withdrawal error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [amount, availableBalance, onClose, onSuccess]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[var(--accent)] rounded-lg p-8 shadow-2xl w-full max-w-md">
        <h2 className="text-[var(--background)] text-2xl font-bold mb-4">Request Withdrawal</h2>
        
        {error && <p className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-md px-4 py-2 mb-4 text-sm">{error}</p>}
        
        <div className="mb-4">
          <label htmlFor="amount" className="block text-[var(--text-light)] text-sm font-bold mb-2">
            Amount (USD)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 rounded bg-[var(--sidebar-linkcolor)]/20 border border-transparent focus:border-[var(--mutant-color)] focus:ring-[var(--mutant-color)] text-[var(--background)]"
            placeholder="e.g., 100.00"
            min="0"
            step="0.01"
          />
           <p className="text-[var(--text-light)] text-xs mt-2">
            Available for withdrawal: ${availableBalance.toFixed(2)}
          </p>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 rounded text-[var(--text)] bg-transparent hover:bg-[var(--sidebar-linkcolor)]/30 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleWithdraw}
            disabled={isLoading}
            className="px-6 py-2 rounded bg-[var(--mutant-color)] text-white font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </div>
    </div>
  );
}
