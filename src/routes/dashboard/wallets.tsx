import { createFileRoute, Link } from "@tanstack/react-router";
import { useWallets } from "@/hooks";
import { formatCurrency, formatDate } from "@/utils/format";
import { Wallet, Plus, Loader2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/wallets")({
  component: WalletsPage,
});

function WalletsPage() {
  const { data, isLoading } = useWallets();
  const wallets = data?.wallets || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wallets</h1>
          <p className="text-gray-600">Manage your multi-currency wallets</p>
        </div>
        <Link to="/dashboard/wallets/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          New Wallet
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : wallets.length === 0 ? (
        <div className="card text-center py-12">
          <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            No wallets yet
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first wallet to get started
          </p>
          <Link to="/dashboard/wallets/new" className="btn-primary">
            Create Wallet
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {wallets.map((wallet) => (
            <Link
              key={wallet.id}
              to="/dashboard/wallets/$walletId"
              params={{ walletId: wallet.id }}
              className="card hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">
                    {wallet.currency}
                  </span>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    wallet.status === "active"
                      ? "bg-green-100 text-green-700"
                      : wallet.status === "locked"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {wallet.status}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {formatCurrency(wallet.balance, wallet.currency)}
              </p>
              <p className="text-sm text-gray-500">
                Created {formatDate(wallet.created_at)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
