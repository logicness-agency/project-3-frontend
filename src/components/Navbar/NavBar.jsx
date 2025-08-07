import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logOutUser } = useContext(AuthContext);

  const linkClasses = (path) =>
    `px-4 py-2 rounded-full font-semibold text-sm md:text-base transition-all duration-200
     ${location.pathname === path
       ? "bg-purple-700 text-white shadow-lg"
       : "text-white hover:bg-purple-600 hover:shadow-md"}`;

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-black/30 backdrop-blur-md px-6 py-3 rounded-full shadow-md flex space-x-4">

        {/* Home always on*/}
        <Link to="/" className={linkClasses("/")}>
          Home
        </Link>

        {/* About only when not logged in*/}
        {!isLoggedIn && (
          <Link to="/about" className={linkClasses("/about")}>
            About
          </Link>
        )}

        {/* when I logged in : Dashboard, Profile, Logout */}
        {isLoggedIn && (
          <>
            <Link to="/dashboard" className={linkClasses("/dashboard")}>
              Dashboard
            </Link>

            <Link to="/profile" className={linkClasses("/profile")}>
              Profile
            </Link>

            <button
              onClick={() => {
                logOutUser();
                navigate("/"); // after Logout to Home
              }}
              className="text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        )}

        {/* when not logged in: Login, Signup */}
        {!isLoggedIn && (
          <>
            <Link to="/login" className={linkClasses("/login")}>
              Login
            </Link>

            <Link to="/signup" className={linkClasses("/signup")}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

