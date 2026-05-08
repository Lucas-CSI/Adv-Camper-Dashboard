import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { modulesApi } from "../../services/api";
import { DifficultyBadge, Spinner } from "../../components/ui";

export default function AdminDashboard() {
  const [modules, setModules] = useState([]);
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

  const handleDelete = async (mod) => {
    if (!window.confirm(`Delete "${mod.title}" and all its lessons? This cannot be undone.`)) return;
    setDeleting(mod.id);
    try {
      await modulesApi.delete(mod.id);
      setModules((prev) => prev.filter((m) => m.id !== mod.id));
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(null);
    }
  };

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
              Create and edit modules, lessons, and questions.
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
            { label: "Total lessons", value: modules.reduce((a, m) => a + (m.lessons?.length ?? 0), 0) },
            { label: "Easy / Medium / Hard", value: `${modules.filter(m => m.difficulty === "EASY").length} / ${modules.filter(m => m.difficulty === "MEDIUM").length} / ${modules.filter(m => m.difficulty === "HARD").length}` },
          ].map((stat) => (
            <div key={stat.label} className="card p-4">
              <p className="text-2xl font-display font-bold text-cyber-accent">{stat.value}</p>
              <p className="text-xs font-mono text-cyber-muted mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Modules table */}
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
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cyber-border">
                  <th className="text-left px-5 py-3 text-xs font-display font-medium text-cyber-muted uppercase tracking-wide">Module</th>
                  <th className="text-left px-5 py-3 text-xs font-display font-medium text-cyber-muted uppercase tracking-wide hidden md:table-cell">Difficulty</th>
                  <th className="text-left px-5 py-3 text-xs font-display font-medium text-cyber-muted uppercase tracking-wide hidden md:table-cell">Lessons</th>
                  <th className="text-left px-5 py-3 text-xs font-display font-medium text-cyber-muted uppercase tracking-wide hidden md:table-cell">Order</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {modules.map((mod, i) => (
                  <tr key={mod.id}
                    className="border-b border-cyber-border last:border-0 hover:bg-cyber-surface/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-display font-medium text-cyber-text text-sm">{mod.title}</p>
                      <p className="font-mono text-xs text-cyber-muted mt-0.5">{mod.slug}</p>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <DifficultyBadge difficulty={mod.difficulty} />
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="font-mono text-sm text-cyber-subtext">
                        {mod.lessons?.length ?? 0}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="font-mono text-sm text-cyber-subtext">
                        #{mod.displayOrder}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link to={`/admin/modules/${mod.id}/lessons/new`}
                          className="text-xs font-display text-cyber-accent hover:underline">
                          + Lesson
                        </Link>
                        <Link to={`/admin/modules/${mod.id}/edit`}
                          className="text-xs font-display text-cyber-subtext hover:text-cyber-text transition-colors">
                          Edit
                        </Link>
                        <button onClick={() => handleDelete(mod)}
                          disabled={deleting === mod.id}
                          className="text-xs font-display text-red-500 hover:text-red-400 transition-colors disabled:opacity-40">
                          {deleting === mod.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
