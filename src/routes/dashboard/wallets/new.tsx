import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useCreateWallet } from "@/hooks";
import { CURRENCIES } from "@/utils/constants";
import { Loader2, Check } from "lucide-react";

export const Route = createFileRoute("/dashboard/wallets/new")({
  component: NewWalletPage,
});

function NewWalletPage() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useCreateWallet();
  const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);

  const handleCreate = () => {
    if (!selectedCurrency) return;

    mutate(
      { currency: selectedCurrency },
      {
        onSuccess: (data) => {
          navigate({
            to: "/dashboard/wallets/$walletId",
            params: { walletId: data.wallet.id },
          });
        },
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Wallet</h1>
        <p className="text-gray-600">Select a currency for your new wallet</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {(error as any).response?.data?.error || "Failed to create wallet"}
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {CURRENCIES.map((currency) => (
          <button
            key={currency.code}
            onClick={() => setSelectedCurrency(currency.code)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              selectedCurrency === currency.code
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">{currency.code}</p>
                <p className="text-sm text-gray-500">{currency.name}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedCurrency === currency.code
                    ? "border-blue-600 bg-blue-600"
                    : "border-gray-300"
                }`}
              >
                {selectedCurrency === currency.code && (
                  <Check className="w-4 h-4 text-white" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate({ to: "/dashboard/wallets" })}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          onClick={handleCreate}
          disabled={!selectedCurrency || isPending}
          className="btn-primary"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Create Wallet"
          )}
        </button>
      </div>
    </div>
  );
}
