import Orb from '../components/Orb/Orb';
import { Link } from "react-router-dom";
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-dark overflow-hidden font-grotesk flex flex-col">
      
      <div className="absolute inset-0 z-0">
        <Orb
          hoverIntensity={2}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
      </div>

     
      <div className="flex-1 z-10 flex flex-col items-center justify-center text-white text-center space-y-6 pointer-events-none">
        <h1 className="text-5xl font-bold max-w-xl">
          Are you ready to get tinqs done?
        </h1>

        <div className="flex space-x-4 pointer-events-auto">
          <Link to="/signup">
            <button className="bg-white text-black font-semibold px-10 py-3 rounded-full shadow-md hover:opacity-90 transition">
              Get Started
            </button>
          </Link>

          <Link to="/about">
            <button className="bg-white/10 border border-white/20 text-white px-10 py-3 rounded-full hover:bg-purple-700 transition">
              Learn More
            </button>
          </Link>
        </div>
      </div>

      
      <Footer />
    </div>
  );
}
