import Aurora from '../components/Aurora/Aurora';
import Footer from "../components/Footer.jsx";

export default function About() {
  return (
    <div className="absolute inset-0 z-0 bg-dark">
      <Aurora
        colorStops={["#A855F7", "#B685FF", "#9ABAE5"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />

      <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
        <div className="max-w-3xl w-full rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 text-purple-100">
          <p className="text-base leading-relaxed">
           Tinqs is a task management app that makes progress visible and keeps you on track.
           Built with React, Node.js, and MongoDB.
           Forget boring to-do lists — Tinqs delivers a dopamine kick with a UI inspired by the Berlin techno scene.   
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
