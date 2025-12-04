import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useWallet, useWalletEvents } from "@/hooks";
import { formatCurrency, formatDateTime, truncateId } from "@/utils/format";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { DepositModal } from "@/components/DepositModal";
import { WithdrawModal } from "@/components/WithdrawModal";

export const Route = createFileRoute("/dashboard/wallets/$walletId")({
  component: WalletDetailPage,
});

function WalletDetailPage() {
  const { walletId } = Route.useParams();
  const { data: walletData, isLoading: walletLoading } = useWallet(walletId);
  const { data: eventsData, isLoading: eventsLoading } =
    useWalletEvents(walletId);

  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [copied, setCopied] = useState(false);

  const wallet = walletData?.wallet;
  const events = eventsData?.events || [];

  const copyId = async () => {
    await navigator.clipboard.writeText(walletId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (walletLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Wallet not found</p>
        <Link to="/dashboard/wallets" className="btn-primary mt-4">
          Back to Wallets
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/dashboard/wallets"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Wallets
      </Link>

      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm text-gray-500">Wallet ID</p>
              <button
                onClick={copyId}
                className="text-gray-400 hover:text-gray-600"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-sm font-mono text-gray-700 mb-4">
              {truncateId(walletId, 16)}
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(wallet.balance, wallet.currency)}
            </p>
            <p className="text-gray-500">{wallet.currency} Wallet</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowDeposit(true)}
              className="btn-primary"
            >
              <ArrowDownRight className="w-4 h-4" />
              Deposit
            </button>
            <button
              onClick={() => setShowWithdraw(true)}
              className="btn-outline"
            >
              <ArrowUpRight className="w-4 h-4" />
              Withdraw
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>

        {eventsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No activity yet</p>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      event.event_type.includes("deposit") ||
                      event.event_type.includes("credit")
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {event.event_type.includes("deposit") ||
                    event.event_type.includes("credit") ? (
                      <ArrowDownRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowUpRight className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {event.event_type}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDateTime(event.created_at)}
                    </p>
                  </div>
                </div>
                <p
                  className={`font-medium ${
                    event.event_type.includes("deposit") ||
                    event.event_type.includes("credit")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {event.event_type.includes("deposit") ||
                  event.event_type.includes("credit")
                    ? "+"
                    : "-"}
                  {formatCurrency(event.amount, wallet.currency)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <DepositModal
        isOpen={showDeposit}
        onClose={() => setShowDeposit(false)}
        walletId={walletId}
        currency={wallet.currency}
      />

      <WithdrawModal
        isOpen={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        walletId={walletId}
        currency={wallet.currency}
        balance={wallet.balance}
      />
    </div>
  );
}
