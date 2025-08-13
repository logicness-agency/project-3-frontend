import Aurora from "../components/Aurora/Aurora";
import { useState } from "react";

export default function Profile() {
  const mockUser = {
    name: "John Doe",
    email: "john@example.com",
    createdAt: "2025-08-07",
  };

  const [name, setName] = useState(mockUser.name);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  return (
    <div className="relative min-h-screen bg-dark font-grotesk overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#A855F7", "#B685FF", "#9ABAE5"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      {/* Profile Card */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-16 pb-8">
        <div className="w-full max-w-sm bg-[#1c1c1e] rounded-xl shadow-xl p-6 card--border-glow text-white space-y-6">

          {/* Avatar */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-purple-500/20 border-2 border-purple-300 text-purple-200 flex items-center justify-center text-2xl font-bold shadow-md">
              {name.charAt(0)}
            </div>
          </div>

          {/* Editable Name */}
          <div className="space-y-1">
            <label htmlFor="name" className="text-xs text-gray-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full p-2 text-sm rounded-lg bg-[#2a2a2e] border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white transition"
            />
          </div>

          {/* Email (disabled) */}
          <div className="space-y-1">
            <label className="text-xs text-gray-300">Email</label>
            <input
              value={mockUser.email}
              disabled
              className="w-full p-2 text-sm rounded-lg bg-[#2a2a2e] text-gray-400 border border-gray-700"
            />
          </div>

          {/* Change Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-xs text-gray-300">
              New Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full p-2 text-sm rounded-lg bg-[#2a2a2e] border border-gray-600 text-gray-400"
              disabled
            />
            <button
              disabled
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
            >
              Change Password
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-2" />

          {/* Account Info + Delete */}
          <div className="text-center text-xs text-gray-500">
            Tinqer since: {mockUser.createdAt}
          </div>
          <button
            disabled
            className="w-full bg-red-600/80 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}