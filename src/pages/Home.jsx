import Orb from '../components/Orb/Orb';
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="relative w-full h-screen bg-dark overflow-hidden font-grotesk ">
            {/* Background Orb */}
            <div className="absolute inset-0 z-0">
                <Orb
                    hoverIntensity={2}
                    rotateOnHover={true}
                    hue={0}
                    forceHoverState={false}
                />
            </div>

            {/* Foreground Content */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-white text-center space-y-6 pointer-events-none">
                <h1 className=" text-5xl font-bold max-w-xl">
                    Are you ready to get things done?
                </h1>

                <div className="flex space-x-4 pointer-events-auto">
                    <Link to="/signup">
                        <button className="bg-white text-black font-semibold px-12 py-4 rounded-full shadow-md hover:opacity-90 transition">
                            Get Started
                        </button>
                    </Link>
                    <button className="bg-white/10 border border-white/20 text-white px-12 py-4 rounded-full hover:bg-purple-700 transition">
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );
}
