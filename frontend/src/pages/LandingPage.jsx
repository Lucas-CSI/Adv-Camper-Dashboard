import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const features = [
  { icon: "🛡️", title: "Guided modules", desc: "Structured learning paths from beginner to advanced." },
  { icon: "🚩", title: "Flag challenges", desc: "Submit flags and earn points for each correct answer." },
  { icon: "📈", title: "Track progress", desc: "See exactly how far you've come across every module." },
];

export default function LandingPage() {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen grid-bg overflow-hidden">
      <div className="scanline" />

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-32 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full
                        border border-cyber-accent/30 bg-cyber-accent/5 mb-8 animate-in">
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-accent animate-pulse-slow" />
          <span className="text-cyber-accent text-xs font-mono">Now in beta</span>
        </div>

        <h1 className="font-display font-extrabold text-5xl md:text-7xl text-cyber-text
                       tracking-tight leading-none mb-6 animate-in"
            style={{ animationDelay: "80ms" }}>
          Learn security.<br />
          <span className="text-cyber-accent glow-text">Hack your way</span> up.
        </h1>

        <p className="text-cyber-subtext text-lg max-w-xl mx-auto mb-10 animate-in"
           style={{ animationDelay: "160ms" }}>
          Hands-on cybersecurity training through guided lessons, flag challenges,
          and point-based progression.
        </p>

        <div className="flex items-center justify-center gap-4 animate-in"
             style={{ animationDelay: "240ms" }}>
          <Link to="/register" className="btn-primary px-8 py-3 text-base">
            Get started free
          </Link>
          <Link to="/modules" className="btn-ghost px-8 py-3 text-base">
            Browse modules
          </Link>
        </div>
      </div>

      {/* Feature cards */}
      <div className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div key={i} className="card p-5 animate-in"
                 style={{ animationDelay: `${320 + i * 80}ms` }}>
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-display font-semibold text-cyber-text text-sm mb-1">
                {f.title}
              </h3>
              <p className="text-cyber-subtext text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
