
import Aurora from '../components/Aurora/Aurora';

export default function About() {
    return (
        <div className="absolute inset-0 z-0 bg-dark">
            <Aurora
                colorStops={["#A855F7", "#B685FF", "#9ABAE5"]}
                blend={0.5}
                amplitude={1.0}
                speed={0.5}
            />
        </div>
    )
}