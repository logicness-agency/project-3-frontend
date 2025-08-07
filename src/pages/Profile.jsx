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
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-24">
        <div className="w-full max-w-md bg-[#1c1c1e] rounded-2xl shadow-xl p-8 card--border-glow text-white space-y-8 transition-all">

          {/* Avatar */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-purple-500/20 border-2 border-purple-300 text-purple-200 flex items-center justify-center text-3xl font-bold shadow-md">
              {name.charAt(0)}
            </div>
          </div>

          {/* Editable Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm text-gray-300">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              className="w-full p-2 rounded-full bg-[#2a2a2e] border border-gray-600 focus:border-purpleGlow focus:ring-purpleGlow text-white transition"
            />
          </div>

          {/* Email (disabled) */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Email</label>
            <input
              value={mockUser.email}
              disabled
              className="w-full p-2 rounded-full bg-[#2a2a2e] text-white border border-gray-700 opacity-50"
            />
          </div>

          {/* Change Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm text-gray-300">
              New Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full p-2 rounded-full bg-[#2a2a2e] border border-gray-600 focus:border-purpleGlow focus:ring-purpleGlow text-white transition"
              disabled
            />
            <button
              disabled
              className="w-full bg-purpleGlow text-white py-2 px-4 rounded-full font-semibold hover:bg-purple-700 transition"
            >
              Change Password
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700" />

          {/* Account Info + Delete */}
          <div className="text-center text-sm text-gray-500">
            Tinqer since: {mockUser.createdAt}
          </div>
          <button
            disabled
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-full font-semibold transition"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
