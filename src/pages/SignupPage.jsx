import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Aurora from "../components/Aurora/Aurora";

const API_URL = process.env.REACT_APP_API_URL;

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const requestBody = { email, password, name };
      const res = await axios.post(`${API_URL}/auth/signup`, requestBody);
      console.log("Signup success:", res.data);
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      const msg = error.response?.data?.message || "Signup failed. Please try again.";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="bg-dark min-h-screen flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 z-0">
        <Aurora colorStops={["#A855F7", "#B685FF", "#9ABAE5"]} blend={0.5} amplitude={1.0} speed={0.5} />
      </div>

      <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg p-6 md:p-8 rounded-xl bg-[#1c1c1e] card--border-glow text-white shadow-lg">
        <form onSubmit={handleSignupSubmit} className="grid grid-cols-1 gap-3 md:gap-4">
          <h3 className="text-xl md:text-2xl font-semibold text-white mb-4 md:mb-6">Sign Up</h3>

          <label htmlFor="email" className="text-white text-sm md:text-base font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#2a2a2e] text-white border border-gray-600 rounded-full px-3 py-2 md:px-4 md:py-2.5 w-full focus:border-purpleGlow focus:ring-1 focus:ring-purpleGlow transition"
            autoComplete="email"
            required
          />

          <label htmlFor="password" className="text-white text-sm md:text-base font-medium">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#2a2a2e] text-white border border-gray-600 rounded-full px-3 py-2 md:px-4 md:py-2.5 w-full focus:border-purpleGlow focus:ring-1 focus:ring-purpleGlow transition"
            autoComplete="new-password"
            minLength={6}
            required
          />

          <label htmlFor="name" className="text-white text-sm md:text-base font-medium">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-[#2a2a2e] text-white border border-gray-600 rounded-full px-3 py-2 md:px-4 md:py-2.5 w-full focus:border-purpleGlow focus:ring-1 focus:ring-purpleGlow transition"
            autoComplete="name"
            required
          />

          <button
            type="submit"
            className="bg-purpleGlow rounded-full hover:bg-purple-700 text-white font-semibold py-2 md:py-2.5 px-4 mt-3 md:mt-4 transition"
          >
            Create Account
          </button>

          {errorMessage && (
            <p className="text-red-500 text-sm md:text-base mt-2">{errorMessage}</p>
          )}

          <p className="mt-3 md:mt-4 text-gray-300 text-sm md:text-base">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupPage;
