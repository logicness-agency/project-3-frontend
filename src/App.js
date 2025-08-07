import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Navbar from './components/Navbar/NavBar';
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import About from "./pages/About";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element = {<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
