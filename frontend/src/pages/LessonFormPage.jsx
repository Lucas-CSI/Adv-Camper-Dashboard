import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { lessonsApi, modulesApi } from "../../services/api";
import { Spinner, Alert } from "../../components/ui";

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];

const empty = {
  title: "",
  content: "",
  difficulty: "EASY",
  displayOrder: 1,
  estimatedMinutes: 10,
  points: 100,
};

export default function LessonFormPage() {
  // /admin/modules/:moduleId/lessons/new  → create
  // /admin/lessons/:lessonId/edit         → edit
  const { moduleId, lessonId } = useParams();
  const isEdit = Boolean(lessonId);
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("edit"); // "edit" | "preview"

  useEffect(() => {
    const load = async () => {
      try {
        if (isEdit) {
          const lesson = await lessonsApi.getById(lessonId);
          setForm({
            title: lesson.title ?? "",
            content: lesson.content ?? "",
            difficulty: lesson.difficulty ?? "EASY",
            displayOrder: lesson.displayOrder ?? 1,
            estimatedMinutes: lesson.estimatedMinutes ?? 10,
            points: lesson.points ?? 100,
          });
          // Load parent module for breadcrumb
          if (lesson.module?.id) {
            const mod = await modulesApi.getById(lesson.module.id);
            setModule(mod);
          }
        } else {
          const mod = await modulesApi.getById(moduleId);
          setModule(mod);
          // Default display order to next available
          setForm((f) => ({ ...f, displayOrder: (mod.lessons?.length ?? 0) + 1 }));
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isEdit, lessonId, moduleId]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        displayOrder: parseInt(form.displayOrder, 10),
        estimatedMinutes: parseInt(form.estimatedMinutes, 10),
        points: parseInt(form.points, 10),
        module: { id: isEdit ? module?.id : parseInt(moduleId, 10) },
      };
      if (isEdit) {
        await lessonsApi.update(lessonId, payload);
      } else {
        await lessonsApi.create(payload);
      }
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-cyber-muted mb-6 animate-in">
          <Link to="/admin" className="hover:text-cyber-accent transition-colors">Admin</Link>
          <span>/</span>
          {module && <span className="text-cyber-subtext">{module.title}</span>}
          {module && <span>/</span>}
          <span className="text-cyber-subtext">{isEdit ? "Edit lesson" : "New lesson"}</span>
        </div>

        <h1 className="font-display font-bold text-2xl text-cyber-text tracking-tight mb-6 animate-in">
          {isEdit ? "Edit lesson" : "Create lesson"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5 animate-in">
          <Alert type="error" message={error} />

          {/* Meta card */}
          <div className="card p-6 space-y-5">
            <h2 className="font-display font-semibold text-cyber-text text-sm">Details</h2>

            {/* Title */}
            <div>
              <label className="block text-xs font-display font-medium text-cyber-subtext mb-1.5 uppercase tracking-wide">
                Title <span className="text-red-500">*</span>
              </label>
              <input className="input" placeholder="e.g. Introduction to the terminal"
                value={form.title} onChange={set("title")} required />
            </div>

            {/* Row: difficulty, order, minutes, points */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-display font-medium text-cyber-subtext mb-1.5 uppercase tracking-wide">
                  Difficulty
                </label>
                <select className="input" value={form.difficulty} onChange={set("difficulty")}>
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-display font-medium text-cyber-subtext mb-1.5 uppercase tracking-wide">
                  Order
                </label>
                <input type="number" className="input" min={1}
                  value={form.displayOrder} onChange={set("displayOrder")} />
              </div>
              <div>
                <label className="block text-xs font-display font-medium text-cyber-subtext mb-1.5 uppercase tracking-wide">
                  Est. minutes
                </label>
                <input type="number" className="input" min={1}
                  value={form.estimatedMinutes} onChange={set("estimatedMinutes")} />
              </div>
              <div>
                <label className="block text-xs font-display font-medium text-cyber-subtext mb-1.5 uppercase tracking-wide">
                  Points
                </label>
                <input type="number" className="input" min={0}
                  value={form.points} onChange={set("points")} />
              </div>
            </div>
          </div>

          {/* Content card with edit/preview tabs */}
          <div className="card overflow-hidden">
            <div className="flex border-b border-cyber-border">
              <button type="button"
                onClick={() => setActiveTab("edit")}
                className={`px-5 py-3 text-xs font-display font-medium transition-colors
                  ${activeTab === "edit"
                    ? "text-cyber-accent border-b-2 border-cyber-accent -mb-px"
                    : "text-cyber-muted hover:text-cyber-subtext"}`}>
                Write
              </button>
              <button type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-5 py-3 text-xs font-display font-medium transition-colors
                  ${activeTab === "preview"
                    ? "text-cyber-accent border-b-2 border-cyber-accent -mb-px"
                    : "text-cyber-muted hover:text-cyber-subtext"}`}>
                Preview
              </button>
              <div className="ml-auto flex items-center px-4">
                <span className="text-xs font-mono text-cyber-muted">Markdown supported</span>
              </div>
            </div>

            {activeTab === "edit" ? (
              <textarea
                className="w-full bg-transparent px-5 py-4 text-sm font-mono text-cyber-text
                           placeholder-cyber-muted focus:outline-none resize-none min-h-[320px]"
                placeholder={`# Introduction\n\nWrite your lesson content here using **Markdown**.\n\n## Key concepts\n\n- Point one\n- Point two\n\n\`\`\`bash\necho "Hello, world!"\n\`\`\``}
                value={form.content}
                onChange={set("content")}
              />
            ) : (
              <div className="px-5 py-4 min-h-[320px] text-sm text-cyber-subtext leading-relaxed">
                {form.content
                  ? <pre className="whitespace-pre-wrap font-mono text-xs text-cyber-subtext">{form.content}</pre>
                  : <p className="text-cyber-muted italic">Nothing to preview yet.</p>}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving}
              className="btn-primary flex items-center gap-2">
              {saving ? <Spinner size="sm" /> : null}
              {saving ? "Saving..." : isEdit ? "Save changes" : "Create lesson"}
            </button>
            {isEdit && (
              <Link to={`/admin/lessons/${lessonId}/questions`}
                className="btn-ghost">
                Manage questions →
              </Link>
            )}
            <Link to="/admin" className="btn-ghost">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
