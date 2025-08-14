import Aurora from "../components/Aurora/Aurora";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

export default function Profile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState({ text: "", isError: false });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const storedToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setUser(response.data);
        setName(response.data.name);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [storedToken]);

  const handleNameChange = async () => {
    try {
      await axios.put(
        `${API_URL}/auth/profile`,
        { name },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      setMessage({ text: "Name updated successfully", isError: false });
      setTimeout(() => setMessage({ text: "", isError: false }), 3000);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Error updating name", isError: true });
      setTimeout(() => setMessage({ text: "", isError: false }), 3000);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Passwords don't match", isError: true });
      setTimeout(() => setMessage({ text: "", isError: false }), 3000);
      return;
    }

    try {
      await axios.put(
        `${API_URL}/auth/change-password`,
        { newPassword },
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      setMessage({ text: "Password changed successfully", isError: false });
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setMessage({ text: "", isError: false }), 3000);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Error changing password", isError: true });
      setTimeout(() => setMessage({ text: "", isError: false }), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      try {
        await axios.delete(`${API_URL}/auth/delete-account`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        localStorage.removeItem("authToken");
        navigate("/");
      } catch (err) {
        setMessage({ text: err.response?.data?.message || "Error deleting account", isError: true });
        setTimeout(() => setMessage({ text: "", isError: false }), 3000);
      }
    }
  };

  if (isLoading) return <div className="text-white text-center p-6">Loading...</div>;
  if (!user) return <div className="text-white text-center p-6">User not found</div>;

  return (
    <div className="relative min-h-screen bg-dark font-grotesk overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={["#A855F7", "#B685FF", "#9ABAE5"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 pt-24">
        <div className="w-full max-w-md bg-[#1c1c1e] rounded-2xl shadow-xl p-8 card--border-glow text-white space-y-6">
          {message.text && (
            <div className={`p-3 rounded-lg ${
              message.isError 
                ? "bg-red-600/20 border border-red-600 text-red-300"
                : "bg-green-600/20 border border-green-600 text-green-300"
            }`}>
              {message.text}
            </div>
          )}

          {/* Avatar */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-purple-500/20 border-2 border-purple-300 text-purple-200 flex items-center justify-center text-3xl font-bold shadow-md">
              {user.name.charAt(0)}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-full bg-[#2a2a2e] border border-gray-600 text-white"
            />
            <button
              onClick={handleNameChange}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-full font-semibold transition"
            >
              Update Name
            </button>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Email</label>
            <input
              value={user.email}
              disabled
              className="w-full p-3 rounded-full bg-[#2a2a2e] text-gray-400 border border-gray-700"
            />
          </div>

          {/* Password Change */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}

              className="w-full p-3 rounded-full bg-[#2a2a2e] border border-gray-600 text-white"
            />
            
            <button
              onClick={handlePasswordChange}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-full font-semibold transition"
            >
              Change Password
            </button>
          </div>

          {/* Delete Account */}
          <div className="pt-4 border-t border-gray-700">
            <button
              onClick={handleDeleteAccount}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-full font-semibold transition"
            >
              Delete Account
            </button>
            <p className="text-xs text-white mt-2 text-center">
              tinqer since: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}