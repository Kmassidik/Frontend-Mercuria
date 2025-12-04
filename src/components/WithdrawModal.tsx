import { useState, useEffect, useRef } from "react";
import { useWithdraw } from "@/hooks";
import { generateIdempotencyKey } from "@/utils/idempotency";
import { isValidAmount } from "@/utils/validators";
import { formatCurrency } from "@/utils/format";
import { X, Loader2 } from "lucide-react";

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletId: string;
  currency: string;
  balance: string;
}

export function WithdrawModal({
  isOpen,
  onClose,
  walletId,
  currency,
  balance,
}: WithdrawModalProps) {
  const { mutate, isPending, error, reset } = useWithdraw(walletId);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setDescription("");
      setValidationError("");
      reset();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, reset]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidAmount(amount)) {
      setValidationError("Enter a valid amount greater than 0");
      return;
    }

    if (parseFloat(amount) > parseFloat(balance)) {
      setValidationError("Insufficient balance");
      return;
    }

    setValidationError("");

    mutate(
      {
        amount,
        description,
        idempotency_key: generateIdempotencyKey(),
      },
      { onSuccess: onClose }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Withdraw Funds</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {(error || validationError) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
            {validationError ||
              (error as any)?.response?.data?.error ||
              "Withdrawal failed"}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Amount ({currency})</label>
            <input
              ref={inputRef}
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
              placeholder="0.00"
              inputMode="decimal"
            />
            <p className="text-sm text-gray-500 mt-1">
              Available: {formatCurrency(balance, currency)}
            </p>
          </div>

          <div>
            <label className="label">Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              placeholder="Withdrawal note"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="btn-primary flex-1"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Withdraw"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
