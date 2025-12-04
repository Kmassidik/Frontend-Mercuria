import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { useWallets } from "@/hooks";
import { formatCurrency } from "@/utils/format";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useWallets();

  const wallets = data?.wallets || [];
  const totalBalance = wallets.reduce((sum, w) => {
    if (w.currency === "USD") return sum + parseFloat(w.balance);
    return sum;
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.first_name || "User"}
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your wallets.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Balance (USD)</p>
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mt-2" />
              ) : (
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalBalance)}
                </p>
              )}
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Wallets</p>
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mt-2" />
              ) : (
                <p className="text-2xl font-bold text-gray-900">
                  {wallets.length}
                </p>
              )}
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Quick Actions</p>
              <div className="flex gap-2 mt-2">
                <Link
                  to="/dashboard/wallets/new"
                  className="btn-primary btn-sm"
                >
                  <Plus className="w-4 h-4" />
                  New Wallet
                </Link>
              </div>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Wallets */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Wallets</h2>
          <Link
            to="/dashboard/wallets"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : wallets.length === 0 ? (
          <div className="text-center py-8">
            <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No wallets yet</p>
            <Link to="/dashboard/wallets/new" className="btn-primary">
              Create your first wallet
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {wallets.slice(0, 5).map((wallet) => (
              <Link
                key={wallet.id}
                to="/dashboard/wallets/$walletId"
                params={{ walletId: wallet.id }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                    <span className="text-sm font-medium">
                      {wallet.currency}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(wallet.balance, wallet.currency)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {wallet.currency} Wallet
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    wallet.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {wallet.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
