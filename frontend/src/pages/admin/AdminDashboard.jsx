import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { modulesApi } from "../../services/api";
import { DifficultyBadge, Spinner } from "../../components/ui";

export default function AdminDashboard() {
  const [modules, setModules] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState(null);

  const load = () => {
    setLoading(true);
    modulesApi.getAll()
      .then((data) => setModules(data || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleDeleteModule = async (mod) => {
    if (!window.confirm(`Delete "${mod.title}" and all its lessons? This cannot be undone.`)) return;
    setDeleting(`mod-${mod.id}`);
    try {
      await modulesApi.delete(mod.id);
      setModules((prev) => prev.filter((m) => m.id !== mod.id));
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(null);
    }
  };

  const totalLessons = modules.reduce((a, m) => a + (m.lessons?.length ?? 0), 0);

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-in">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30 text-xs">
                Admin
              </span>
            </div>
            <h1 className="font-display font-bold text-3xl text-cyber-text tracking-tight">
              Manage content
            </h1>
            <p className="text-cyber-subtext text-sm mt-1">
              Create modules, add lessons, and manage questions.
            </p>
          </div>
          <Link to="/admin/modules/new" className="btn-primary flex items-center gap-2">
            <span className="text-lg leading-none">+</span> New module
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg border border-red-800 bg-red-950 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total modules", value: modules.length },
            { label: "Total lessons", value: totalLessons },
            { label: "Easy / Medium / Hard", value: `${modules.filter(m => m.difficulty === "EASY").length} / ${modules.filter(m => m.difficulty === "MEDIUM").length} / ${modules.filter(m => m.difficulty === "HARD").length}` },
          ].map((stat) => (
            <div key={stat.label} className="card p-4">
              <p className="text-2xl font-display font-bold text-cyber-accent">{stat.value}</p>
              <p className="text-xs font-mono text-cyber-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Modules list */}
        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : modules.length === 0 ? (
          <div className="card p-16 text-center">
            <p className="font-display text-cyber-subtext mb-3">No modules yet.</p>
            <Link to="/admin/modules/new" className="btn-primary inline-flex">
              Create your first module
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {modules.map((mod) => (
              <div key={mod.id} className="card overflow-hidden">

                {/* Module row */}
                <div className="flex items-center gap-4 px-5 py-4 hover:bg-cyber-surface/40 transition-colors">
                  {/* Expand toggle */}
                  <button onClick={() => toggleExpand(mod.id)}
                    className="text-cyber-muted hover:text-cyber-accent transition-colors flex-shrink-0">
                    <svg viewBox="0 0 20 20" fill="currentColor"
                      className={`w-4 h-4 transition-transform duration-150 ${expanded[mod.id] ? "rotate-90" : ""}`}>
                      <path fillRule="evenodd" d="M7.293 4.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L10.586 9 7.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <p className="font-display font-semibold text-cyber-text text-sm">{mod.title}</p>
                      <DifficultyBadge difficulty={mod.difficulty} />
                    </div>
                    <p className="font-mono text-xs text-cyber-muted mt-0.5">
                      {mod.slug} · {mod.lessons?.length ?? 0} lesson{(mod.lessons?.length ?? 0) !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Module actions */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <Link to={`/admin/modules/${mod.id}/lessons/new`}
                      className="text-xs font-display text-cyber-accent hover:underline">
                      + Add lesson
                    </Link>
                    <Link to={`/admin/modules/${mod.id}/edit`}
                      className="text-xs font-display text-cyber-subtext hover:text-cyber-text transition-colors">
                      Edit
                    </Link>
                    <button onClick={() => handleDeleteModule(mod)}
                      disabled={deleting === `mod-${mod.id}`}
                      className="text-xs font-display text-red-500 hover:text-red-400 transition-colors disabled:opacity-40">
                      {deleting === `mod-${mod.id}` ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>

                {/* Lessons sub-rows */}
                {expanded[mod.id] && (
                  <div className="border-t border-cyber-border">
                    {(mod.lessons?.length ?? 0) === 0 ? (
                      <div className="px-12 py-4 text-xs text-cyber-muted font-mono italic">
                        No lessons yet —{" "}
                        <Link to={`/admin/modules/${mod.id}/lessons/new`}
                          className="text-cyber-accent hover:underline not-italic">
                          add one
                        </Link>
                      </div>
                    ) : (
                      mod.lessons.map((lesson, i) => (
                        <div key={lesson.id}
                          className="flex items-center gap-4 px-12 py-3 border-b border-cyber-border/50
                                     last:border-0 hover:bg-cyber-surface/30 transition-colors">

                          {/* Order number */}
                          <span className="w-5 h-5 rounded flex items-center justify-center
                                           bg-cyber-surface border border-cyber-border
                                           font-display font-bold text-xs text-cyber-muted flex-shrink-0">
                            {lesson.displayOrder ?? i + 1}
                          </span>

                          {/* Lesson info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-display font-medium text-cyber-text text-sm truncate">
                              {lesson.title}
                            </p>
                            <p className="font-mono text-xs text-cyber-muted mt-0.5">
                              {lesson.questions?.length ?? 0} question{(lesson.questions?.length ?? 0) !== 1 ? "s" : ""}
                              {lesson.estimatedMinutes ? ` · ~${lesson.estimatedMinutes} min` : ""}
                              {` · ${lesson.points ?? 0} pts`}
                            </p>
                          </div>

                          {/* Lesson actions */}
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <Link to={`/admin/lessons/${lesson.id}/questions`}
                              className="text-xs font-display text-cyber-accent hover:underline">
                              Manage questions
                            </Link>
                            <Link to={`/admin/lessons/${lesson.id}/edit`}
                              className="text-xs font-display text-cyber-subtext hover:text-cyber-text transition-colors">
                              Edit
                            </Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
