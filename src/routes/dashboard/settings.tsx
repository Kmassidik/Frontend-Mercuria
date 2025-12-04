import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { formatDateTime } from "@/utils/format";
import { User, Mail, Calendar, Shield } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account settings</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Profile Information
        </h2>

        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {user?.first_name || user?.last_name
                  ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
                  : "No name set"}
              </p>
              <p className="text-sm text-gray-500">Full Name</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.email}</p>
              <p className="text-sm text-gray-500">Email Address</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {user?.created_at ? formatDateTime(user.created_at) : "Unknown"}
              </p>
              <p className="text-sm text-gray-500">Member Since</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>

        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">Password</p>
            <p className="text-sm text-gray-500">Last updated: Unknown</p>
          </div>
          <button className="btn-outline btn-sm">Change</button>
        </div>

        <p className="text-sm text-gray-500">
          Keep your account secure by using a strong password and enabling
          two-factor authentication.
        </p>
      </div>

      <div className="card border-red-200">
        <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
        <p className="text-gray-600 mb-4">
          Logging out will end your current session. You'll need to sign in
          again to access your account.
        </p>
        <button onClick={logout} className="btn-danger">
          Logout
        </button>
      </div>
    </div>
  );
}
