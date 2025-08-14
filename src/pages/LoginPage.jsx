import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import Aurora from "../components/Aurora/Aurora";

const API_URL = process.env.REACT_APP_API_URL;

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();
  const { storeToken, authenticateUser } = useContext(AuthContext);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      storeToken(response.data.authToken);
      await authenticateUser();
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="bg-dark min-h-screen flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 z-0">
        <Aurora colorStops={["#A855F7", "#B685FF", "#9ABAE5"]} blend={0.5} amplitude={1.0} speed={0.5} />
      </div>

      
      <div className="relative w-full max-w-sm md:max-w-sm lg:max-w-md p-6 md:p-6 rounded-xl bg-[#1c1c1e] card--border-glow text-white shadow-lg">
        <form onSubmit={handleLoginSubmit} className="grid grid-cols-1 gap-3 md:gap-4">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Login</h3>

          <label htmlFor="email" className="text-gray-300 font-medium text-sm">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-[#2a2a2d] rounded-full text-white border border-gray-600 focus:border-purpleGlow focus:ring-1 focus:ring-purpleGlow px-4 py-2 w-full transition"
            autoComplete="email"
            required
          />

          <label htmlFor="password" className="text-gray-300 font-medium text-sm">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#2a2a2d] rounded-full text-white border border-gray-600 focus:border-purpleGlow focus:ring-1 focus:ring-purpleGlow px-4 py-2 w-full transition"
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            className="bg-purpleGlow rounded-full hover:bg-purple-700 text-white font-semibold py-2.5 px-4 mt-3 transition"
          >
            Log In
          </button>

          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

          <p className="mt-3 text-gray-400 text-sm">Don't have an account yet?</p>
          <Link to="/signup" className="text-purple-400 hover:text-purple-300 hover:underline transition text-sm">
            Sign Up
          </Link>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
