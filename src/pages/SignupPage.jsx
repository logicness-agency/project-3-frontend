import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Aurora from '../components/Aurora/Aurora';

const API_URL = process.env.REACT_APP_API_URL;



function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [errorMessage, setErrorMessage] = useState(undefined);

    const navigate = useNavigate();


    const handleEmail = (e) => setEmail(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);
    const handleName = (e) => setName(e.target.value);


    const handleSignupSubmit = (e) => {
        e.preventDefault();
        // Create an object representing the request body
        const requestBody = { email, password, name };

        // Make an axios request to the API
        // If POST request is successful redirect to login page
        // If the request resolves with an error, set the error message in the state
        axios.post(`${API_URL}/auth/signup`, requestBody)
            .then(() => {
                navigate("/login");
            })
            .catch((error) => {
                const errorDescription = error.response.data.message;
                setErrorMessage(errorDescription);
            })
    };


   return (
  <div className="bg-dark min-h-screen flex items-center justify-center px-4">
          <div className="absolute inset-0 z-0">
            <Aurora
              colorStops={["#A855F7", "#B685FF", "#9ABAE5"]}
              blend={0.5}
              amplitude={1.0}
              speed={0.5}
            />
          </div>
    <div className="relative w-full max-w-2xl p-8 rounded-xl bg-[#1c1c1e] card--border-glow text-white shadow-lg">
      <form onSubmit={handleSignupSubmit} className="grid grid-cols-1 gap-4">
        <h3 className="text-2xl font-semibold text-white mb-6">Sign Up</h3>

        <label htmlFor="email" className="text-white text-sm font-medium">
          Email
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={handleEmail}
          className="border rounded-full p-2 w-full bg-[#2a2a2e] text-white"
        />

        <label htmlFor="password" className="text-white text-sm font-medium">
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={handlePassword}
          className="border rounded-full p-2 w-full bg-[#2a2a2e] text-white"
        />

        <label htmlFor="name" className="text-white text-sm font-medium">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={handleName}
          className="border rounded-full p-2 w-full bg-[#2a2a2e] text-white"
        />

        <button
          type="submit"
          className="bg-purpleGlow rounded-full hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-4 transition duration-150 ease-in-out"
        >
          Create Account
        </button>

        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}

        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  </div>
);
}

export default SignupPage;