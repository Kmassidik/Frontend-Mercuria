import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useWallets, useCreateTransaction } from "@/hooks";
import { validateTransferForm, isValidAmount } from "@/utils/validators";
import { generateIdempotencyKey } from "@/utils/idempotency";
import { formatCurrency } from "@/utils/format";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/transactions/new")({
  component: NewTransactionPage,
});

function NewTransactionPage() {
  const navigate = useNavigate();
  const { data: walletsData, isLoading: walletsLoading } = useWallets();
  const { mutate, isPending, error } = useCreateTransaction();

  const wallets = walletsData?.wallets || [];

  const [fromWalletId, setFromWalletId] = useState("");
  const [toWalletId, setToWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedWallet = wallets.find((w) => w.id === fromWalletId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateTransferForm(toWalletId, amount);
    if (!fromWalletId) validation.fromWalletId = "Select a source wallet";
    if (fromWalletId === toWalletId)
      validation.toWalletId = "Cannot transfer to same wallet";

    if (selectedWallet && isValidAmount(amount)) {
      if (parseFloat(amount) > parseFloat(selectedWallet.balance)) {
        validation.amount = "Insufficient balance";
      }
    }

    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setErrors({});

    mutate(
      {
        from_wallet_id: fromWalletId,
        to_wallet_id: toWalletId,
        amount,
        description,
        idempotency_key: generateIdempotencyKey(),
      },
      {
        onSuccess: (data) => {
          navigate({
            to: "/dashboard/transactions/$transactionId",
            params: { transactionId: data.transaction.id },
          });
        },
      }
    );
  };

  if (walletsLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Transfer</h1>
        <p className="text-gray-600">Send funds to another wallet</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {(error as any).response?.data?.error || "Transfer failed"}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="label">From Wallet</label>
          <select
            value={fromWalletId}
            onChange={(e) => setFromWalletId(e.target.value)}
            className="input"
          >
            <option value="">Select wallet</option>
            {wallets.map((w) => (
              <option key={w.id} value={w.id}>
                {w.currency} - {formatCurrency(w.balance, w.currency)}
              </option>
            ))}
          </select>
          {errors.fromWalletId && (
            <p className="error-text">{errors.fromWalletId}</p>
          )}
        </div>

        <div>
          <label className="label">To Wallet ID</label>
          <input
            type="text"
            value={toWalletId}
            onChange={(e) => setToWalletId(e.target.value)}
            className="input"
            placeholder="Enter recipient wallet ID"
          />
          {errors.toWalletId && (
            <p className="error-text">{errors.toWalletId}</p>
          )}
        </div>

        <div>
          <label className="label">Amount</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input"
            placeholder="0.00"
          />
          {selectedWallet && (
            <p className="text-sm text-gray-500 mt-1">
              Available:{" "}
              {formatCurrency(selectedWallet.balance, selectedWallet.currency)}
            </p>
          )}
          {errors.amount && <p className="error-text">{errors.amount}</p>}
        </div>

        <div>
          <label className="label">Description (optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input"
            placeholder="What's this for?"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard/transactions" })}
            className="btn-secondary"
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
              "Send Transfer"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
