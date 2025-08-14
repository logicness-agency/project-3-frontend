import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, isLoading, logOutUser } = useContext(AuthContext);

  const linkClasses = (path) =>
    `px-3 py-1.5 rounded-full font-medium text-xs md:text-sm transition duration-200 ${
      location.pathname === path
        ? "bg-purple-700 text-white shadow-lg"
        : "text-white hover:bg-purple-600 hover:shadow-md"
    }`;

  if (isLoading) return null;

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-black/30 backdrop-blur-md px-4 py-2 rounded-full shadow-md flex space-x-2">
        <Link to="/" className={linkClasses("/")}>
          Home
        </Link>

        {!isLoggedIn && (
          <Link to="/about" className={linkClasses("/about")}>
            About
          </Link>
        )}

        {isLoggedIn && (
          <>
            <Link to="/dashboard" className={linkClasses("/dashboard")}>
              Dashboard
            </Link>
            <button
              onClick={() => {
                logOutUser();
                navigate("/");
              }}
              className="text-white px-3 py-1.5 rounded-full hover:bg-red-600 transition text-xs md:text-sm"
            >
              Logout
            </button>
          </>
        )}

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