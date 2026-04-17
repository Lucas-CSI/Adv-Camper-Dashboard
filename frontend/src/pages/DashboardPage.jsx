import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { progressApi, modulesApi } from "../services/api";
import { ProgressRing, DifficultyBadge, StatusBadge, Spinner } from "../components/ui";

export default function DashboardPage() {
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([modulesApi.getAll(), progressApi.getAll()])
      .then(([mods, prog]) => {
        setModules(mods || []);
        setProgress(prog || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const completedCount = progress.filter((p) => p.status === "COMPLETED").length;
  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length ?? 0), 0);
  const overallPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Map lessonId -> status
  const progressMap = {};
  progress.forEach((p) => { progressMap[p.lesson?.id] = p.status; });

  function moduleProgress(mod) {
    if (!mod.lessons?.length) return 0;
    const done = mod.lessons.filter((l) => progressMap[l.id] === "COMPLETED").length;
    return Math.round((done / mod.lessons.length) * 100);
  }

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

        {/* Hero row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 animate-in">
          <div>
            <p className="text-cyber-subtext text-sm font-mono mb-1">
              Welcome back,
            </p>
            <h1 className="font-display font-bold text-3xl text-cyber-text tracking-tight">
              {user?.username}
              <span className="text-cyber-accent">.</span>
            </h1>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-cyber-accent">
                {user?.totalPoints ?? 0}
              </p>
              <p className="text-xs text-cyber-subtext font-mono">total pts</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-display font-bold text-cyber-text">
                {completedCount}
              </p>
              <p className="text-xs text-cyber-subtext font-mono">lessons done</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative">
                <ProgressRing percent={overallPercent} size={64} strokeWidth={4} />
                <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-sm text-cyber-accent">
                  {overallPercent}%
                </span>
              </div>
              <p className="text-xs text-cyber-subtext font-mono mt-1">overall</p>
            </div>
          </div>
        </div>

        {/* Modules grid */}
        <h2 className="section-title text-lg mb-4">Your modules</h2>
        {modules.length === 0 ? (
          <div className="card p-12 text-center text-cyber-subtext">
            <p className="font-display">No modules yet.</p>
            <p className="text-sm mt-1">Check back soon or ask an admin to add content.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod, i) => {
              const pct = moduleProgress(mod);
              return (
                <Link key={mod.id} to={`/modules/${mod.id}`}
                  className="card p-5 group hover:border-cyber-accent/40 hover:shadow-glow transition-all duration-200"
                  style={{ animationDelay: `${i * 60}ms` }}>
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <DifficultyBadge difficulty={mod.difficulty} />
                    <span className="text-xs font-mono text-cyber-muted">
                      {mod.lessons?.length ?? 0} lessons
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-semibold text-cyber-text text-base mb-1
                                 group-hover:text-cyber-accent transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-cyber-subtext text-xs line-clamp-2 mb-4">
                    {mod.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-auto">
                    <div className="flex justify-between text-xs text-cyber-muted mb-1.5 font-mono">
                      <span>{pct === 100 ? "Completed" : "Progress"}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full h-1 bg-cyber-border rounded-full overflow-hidden">
                      <div className="progress-bar" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
