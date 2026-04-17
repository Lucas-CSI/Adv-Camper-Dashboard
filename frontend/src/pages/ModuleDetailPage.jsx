import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { modulesApi, progressApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { DifficultyBadge, StatusBadge, ProgressRing, Spinner, LockIcon } from "../components/ui";

export default function ModuleDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [mod, setMod] = useState(null);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [modData, prog] = await Promise.all([
        modulesApi.getById(id),
        user ? progressApi.getAll() : Promise.resolve([]),
      ]);
      setMod(modData);
      const map = {};
      (prog || []).forEach((p) => { map[p.lesson?.id] = p.status; });
      setProgress(map);
      setLoading(false);
    };
    fetchData();
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!mod) return (
    <div className="min-h-screen flex items-center justify-center text-cyber-subtext">
      Module not found.
    </div>
  );

  const lessons = mod.lessons ?? [];
  const completed = lessons.filter((l) => progress[l.id] === "COMPLETED").length;
  const pct = lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0;

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-cyber-muted mb-6 animate-in">
          <Link to="/modules" className="hover:text-cyber-accent transition-colors">Modules</Link>
          <span>/</span>
          <span className="text-cyber-subtext">{mod.title}</span>
        </div>

        {/* Module header */}
        <div className="card p-6 mb-6 animate-in">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <DifficultyBadge difficulty={mod.difficulty} />
                <span className="text-xs font-mono text-cyber-muted">
                  {lessons.length} lessons
                </span>
              </div>
              <h1 className="font-display font-bold text-2xl text-cyber-text tracking-tight mb-2">
                {mod.title}
              </h1>
              <p className="text-cyber-subtext text-sm leading-relaxed">
                {mod.description}
              </p>
            </div>

            {user && (
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="relative">
                  <ProgressRing percent={pct} size={80} strokeWidth={5} />
                  <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-lg text-cyber-accent">
                    {pct}%
                  </span>
                </div>
                <p className="text-xs font-mono text-cyber-muted">
                  {completed}/{lessons.length} done
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Lessons list */}
        <h2 className="section-title text-base mb-3">Lessons</h2>
        <div className="space-y-2">
          {lessons.map((lesson, i) => {
            const status = progress[lesson.id] || "NOT_STARTED";
            const isLocked = false; // extend later for sequential unlocking

            return (
              <div key={lesson.id}
                className="card p-4 flex items-center gap-4 group animate-in
                           hover:border-cyber-accent/40 transition-all duration-200"
                style={{ animationDelay: `${i * 40}ms` }}>

                {/* Number */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                  font-display font-bold text-sm
                  ${status === "COMPLETED"
                    ? "bg-cyber-accent text-cyber-bg"
                    : "bg-cyber-surface border border-cyber-border text-cyber-muted"}`}>
                  {isLocked ? <LockIcon className="w-4 h-4" /> : i + 1}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-display font-medium text-cyber-text text-sm
                                group-hover:text-cyber-accent transition-colors truncate">
                    {lesson.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs font-mono text-cyber-muted">
                      {lesson.questions?.length ?? 0} questions
                    </span>
                    {lesson.estimatedMinutes && (
                      <span className="text-xs font-mono text-cyber-muted">
                        ~{lesson.estimatedMinutes} min
                      </span>
                    )}
                  </div>
                </div>

                {/* Status + CTA */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {user && <StatusBadge status={status} />}
                  {!isLocked && (
                    <Link to={`/lessons/${lesson.id}`}
                      className="text-xs font-display font-medium text-cyber-accent
                                 hover:underline transition-colors">
                      {status === "COMPLETED" ? "Review" : status === "IN_PROGRESS" ? "Continue" : "Start"} →
                    </Link>
                  )}
                </div>
              </div>
            );
          })}

          {lessons.length === 0 && (
            <div className="card p-10 text-center text-cyber-subtext text-sm">
              No lessons in this module yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
