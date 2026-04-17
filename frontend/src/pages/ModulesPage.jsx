import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { modulesApi } from "../services/api";
import { DifficultyBadge, Spinner } from "../components/ui";

const DIFFICULTIES = ["ALL", "EASY", "MEDIUM", "HARD"];

export default function ModulesPage() {
  const [modules, setModules] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    modulesApi.getAll()
      .then((data) => setModules(data || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "ALL"
    ? modules
    : modules.filter((m) => m.difficulty === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8 animate-in">
          <h1 className="font-display font-bold text-3xl text-cyber-text tracking-tight mb-1">
            All modules
          </h1>
          <p className="text-cyber-subtext text-sm">
            Choose a learning path and start earning points.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {DIFFICULTIES.map((d) => (
            <button key={d} onClick={() => setFilter(d)}
              className={`px-4 py-1.5 rounded-full text-xs font-display font-medium transition-all duration-150
                ${filter === d
                  ? "bg-cyber-accent text-cyber-bg"
                  : "border border-cyber-border text-cyber-subtext hover:border-cyber-accent/50 hover:text-cyber-text"}`}>
              {d.charAt(0) + d.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="card p-12 text-center text-cyber-subtext">
            <p className="font-display">No modules found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((mod, i) => (
              <Link key={mod.id} to={`/modules/${mod.id}`}
                className="card p-5 group hover:border-cyber-accent/40 hover:shadow-glow transition-all duration-200 animate-in"
                style={{ animationDelay: `${i * 50}ms` }}>
                {/* Image placeholder */}
                {mod.imageUrl ? (
                  <img src={mod.imageUrl} alt={mod.title}
                    className="w-full h-28 object-cover rounded-lg mb-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-full h-28 rounded-lg mb-4 bg-cyber-surface border border-cyber-border
                                  flex items-center justify-center grid-bg">
                    <svg viewBox="0 0 24 24" className="w-10 h-10 text-cyber-border fill-current">
                      <path d="M12 1L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4z"/>
                    </svg>
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <DifficultyBadge difficulty={mod.difficulty} />
                  <span className="text-xs font-mono text-cyber-muted">
                    ~{mod.estimatedMinutes ?? "?"} min
                  </span>
                </div>

                <h3 className="font-display font-semibold text-cyber-text text-base mb-1
                               group-hover:text-cyber-accent transition-colors">
                  {mod.title}
                </h3>
                <p className="text-cyber-subtext text-xs line-clamp-2">
                  {mod.description}
                </p>

                <div className="mt-4 flex items-center justify-between text-xs font-mono text-cyber-muted">
                  <span>{mod.lessons?.length ?? 0} lessons</span>
                  <span className="text-cyber-accent group-hover:underline">View →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
