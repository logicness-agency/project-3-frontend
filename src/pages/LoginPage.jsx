import { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

import Aurora from '../components/Aurora/Aurora';



const API_URL = process.env.REACT_APP_API_URL;

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(undefined);

    const navigate = useNavigate();
    const { storeToken, authenticateUser } = useContext(AuthContext);

    const handleEmail = (e) => setEmail(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        const requestBody = { email, password };

        axios
            .post(`${API_URL}/auth/login`, requestBody)
            .then((response) => {
                storeToken(response.data.authToken);
                authenticateUser();
                navigate("/dashboard");
            })
            .catch((error) => {
                const errorDescription = error.response.data.message;
                setErrorMessage(errorDescription);
            });

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
                <form onSubmit={handleLoginSubmit} className="grid grid-cols-1 gap-4">
                    <h3 className="text-3xl font-bold text-white mb-6">Login</h3>

                    <label htmlFor="email" className="text-gray-300 font-medium">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={handleEmail}
                        className="bg-[#2a2a2d] rounded-full text-white border border-gray-600 focus:border-purpleGlow focus:ring-1 focus:ring-purpleGlow rounded p-2 w-full mb-2 transition-all duration-150"
                        autoComplete="off"
                    />

                    <label htmlFor="password" className="text-gray-300 font-medium">
                        Password
                    </label>
                    <input
                        type="password"
                        name="password"
                        id="password"
                        value={password}
                        onChange={handlePassword}
                        className="bg-[#2a2a2d] rounded-full text-white border border-gray-600 focus:border-purpleGlow focus:ring-1 focus:ring-purpleGlow rounded p-2 w-full mb-2 transition-all duration-150"
                        autoComplete="off"
                    />

                    <button
                        type="submit"
                        className="bg-purpleGlow rounded-full hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-4 transition duration-150 ease-in-out"
                    >
                        Log In
                    </button>

                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                    <p className="mt-4 text-gray-400">Don't have an account yet?</p>
                    <Link to="/signup" className="text-purple-400 hover:text-purple-300 hover:underline transition">
                        Sign Up
                    </Link>
                </form>
            </div>
        </div>

    );
}

export default LoginPage;
