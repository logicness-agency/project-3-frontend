import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const linkClasses = (path) =>
    `px-4 py-2 rounded-full font-semibold text-sm md:text-base transition-all duration-200
     ${location.pathname === path
       ? "bg-purple-700 text-white shadow-lg"
       : "text-white hover:bg-purple-600 hover:shadow-md"}`;

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-black/30 backdrop-blur-md px-6 py-3 rounded-full shadow-md flex space-x-4">
        <Link to="/" className={linkClasses("/")}>
          Home
        </Link>
        <Link to="/dashboard" className={linkClasses("/dashboard")}>
          Dashboard
        </Link>
          <Link to="/login" className={linkClasses("/login")}>
          Login
        </Link>
         <Link to="/about" className={linkClasses("/about")}>
          About
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
