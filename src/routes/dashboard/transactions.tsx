import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useWallets, useTransactions } from "@/hooks";
import { formatCurrency, formatRelativeTime, truncateId } from "@/utils/format";
import { TRANSACTION_STATUSES } from "@/utils/constants";
import { ArrowLeftRight, Plus, Loader2 } from "lucide-react";

export const Route = createFileRoute("/dashboard/transactions")({
  component: TransactionsPage,
});

function TransactionsPage() {
  const { data: walletsData, isLoading: walletsLoading } = useWallets();
  const wallets = walletsData?.wallets || [];

  const [selectedWallet, setSelectedWallet] = useState<string>("");

  const walletId = selectedWallet || wallets[0]?.id || "";
  const { data: txData, isLoading: txLoading } = useTransactions(walletId);
  const transactions = txData?.transactions || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">View and manage your transfers</p>
        </div>
        <Link to="/dashboard/transactions/new" className="btn-primary">
          <Plus className="w-4 h-4" />
          New Transfer
        </Link>
      </div>

      <div className="card">
        <div className="mb-4">
          <label className="label">Select Wallet</label>
          <select
            value={selectedWallet}
            onChange={(e) => setSelectedWallet(e.target.value)}
            className="input max-w-xs"
            disabled={walletsLoading}
          >
            {wallets.map((w) => (
              <option key={w.id} value={w.id}>
                {w.currency} - {formatCurrency(w.balance, w.currency)}
              </option>
            ))}
          </select>
        </div>

        {walletsLoading || txLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : wallets.length === 0 ? (
          <div className="text-center py-8">
            <ArrowLeftRight className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">
              Create a wallet first to view transactions
            </p>
            <Link to="/dashboard/wallets/new" className="btn-primary">
              Create Wallet
            </Link>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8">
            <ArrowLeftRight className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No transactions yet</p>
            <Link to="/dashboard/transactions/new" className="btn-primary">
              Make a Transfer
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions.map((tx) => {
                  const status =
                    TRANSACTION_STATUSES[
                      tx.status as keyof typeof TRANSACTION_STATUSES
                    ];
                  const isOutgoing = tx.from_wallet_id === walletId;

                  return (
                    <tr key={tx.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Link
                          to="/dashboard/transactions/$transactionId"
                          params={{ transactionId: tx.id }}
                          className="font-mono text-sm text-blue-600 hover:text-blue-700"
                        >
                          {truncateId(tx.id)}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={
                            isOutgoing ? "text-red-600" : "text-green-600"
                          }
                        >
                          {isOutgoing ? "Sent" : "Received"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        <span
                          className={
                            isOutgoing ? "text-red-600" : "text-green-600"
                          }
                        >
                          {isOutgoing ? "-" : "+"}
                          {formatCurrency(tx.amount, tx.currency)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            status?.color === "success"
                              ? "bg-green-100 text-green-700"
                              : status?.color === "danger"
                                ? "bg-red-100 text-red-700"
                                : status?.color === "warning"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {status?.label || tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {formatRelativeTime(tx.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
