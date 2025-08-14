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
            The idea was to creat a task management to visiualize progress to stay on track to get things (tinqs) done.
            Built with React, Node.js, and MongoDB. Note apps or to-do list are pretty much boring and take more energy
            than they give. I wanted to creat an app which you want to use and where the ui gives a dopamine kick and
            feels like the Berlin techno scene.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
