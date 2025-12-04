import { createFileRoute, Link } from "@tanstack/react-router";
import { useTransaction } from "@/hooks";
import { formatCurrency, formatDateTime, truncateId } from "@/utils/format";
import { TRANSACTION_STATUSES } from "@/utils/constants";
import { ArrowLeft, Loader2, Copy, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dashboard/transactions/$transactionId")({
  component: TransactionDetailPage,
});

function TransactionDetailPage() {
  const { transactionId } = Route.useParams();
  const { data, isLoading } = useTransaction(transactionId);
  const [copied, setCopied] = useState<string | null>(null);

  const tx = data?.transaction;

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Transaction not found</p>
        <Link to="/dashboard/transactions" className="btn-primary mt-4">
          Back to Transactions
        </Link>
      </div>
    );
  }

  const status =
    TRANSACTION_STATUSES[tx.status as keyof typeof TRANSACTION_STATUSES];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        to="/dashboard/transactions"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Transactions
      </Link>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            Transaction Details
          </h1>
          <span
            className={`text-sm px-3 py-1 rounded-full ${
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
        </div>

        <div className="text-center py-6 border-b mb-6">
          <p className="text-4xl font-bold text-gray-900">
            {formatCurrency(tx.amount, tx.currency)}
          </p>
          <p className="text-gray-500 mt-1">{tx.type} transfer</p>
        </div>

        <dl className="space-y-4">
          <div className="flex justify-between items-center">
            <dt className="text-gray-500">Transaction ID</dt>
            <dd className="flex items-center gap-2">
              <span className="font-mono text-sm">{truncateId(tx.id, 16)}</span>
              <button
                onClick={() => copyToClipboard(tx.id, "id")}
                className="text-gray-400 hover:text-gray-600"
              >
                {copied === "id" ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </dd>
          </div>

          <div className="flex justify-between items-center">
            <dt className="text-gray-500">From Wallet</dt>
            <dd className="flex items-center gap-2">
              <span className="font-mono text-sm">
                {truncateId(tx.from_wallet_id, 12)}
              </span>
              <button
                onClick={() => copyToClipboard(tx.from_wallet_id, "from")}
                className="text-gray-400 hover:text-gray-600"
              >
                {copied === "from" ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </dd>
          </div>

          <div className="flex justify-between items-center">
            <dt className="text-gray-500">To Wallet</dt>
            <dd className="flex items-center gap-2">
              <span className="font-mono text-sm">
                {truncateId(tx.to_wallet_id, 12)}
              </span>
              <button
                onClick={() => copyToClipboard(tx.to_wallet_id, "to")}
                className="text-gray-400 hover:text-gray-600"
              >
                {copied === "to" ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-gray-500">Currency</dt>
            <dd className="font-medium">{tx.currency}</dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-gray-500">Type</dt>
            <dd className="font-medium capitalize">{tx.type}</dd>
          </div>

          {tx.description && (
            <div className="flex justify-between">
              <dt className="text-gray-500">Description</dt>
              <dd className="font-medium">{tx.description}</dd>
            </div>
          )}

          <div className="flex justify-between">
            <dt className="text-gray-500">Created</dt>
            <dd className="text-gray-700">{formatDateTime(tx.created_at)}</dd>
          </div>

          {tx.processed_at && (
            <div className="flex justify-between">
              <dt className="text-gray-500">Processed</dt>
              <dd className="text-gray-700">
                {formatDateTime(tx.processed_at)}
              </dd>
            </div>
          )}

          {tx.scheduled_at && (
            <div className="flex justify-between">
              <dt className="text-gray-500">Scheduled For</dt>
              <dd className="text-gray-700">
                {formatDateTime(tx.scheduled_at)}
              </dd>
            </div>
          )}

          {tx.failure_reason && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <dt className="text-sm text-red-600 font-medium mb-1">
                Failure Reason
              </dt>
              <dd className="text-red-700">{tx.failure_reason}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}
