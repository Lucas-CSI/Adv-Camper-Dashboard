import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { modulesApi } from "../../services/api";
import { Spinner, Alert } from "../../components/ui";

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"];

const empty = {
  title: "",
  slug: "",
  description: "",
  difficulty: "EASY",
  displayOrder: 1,
  imageUrl: "",
};

function toSlug(str) {
  return str.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export default function ModuleFormPage() {
  const { id } = useParams();           // present when editing
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    modulesApi.getById(id)
      .then((mod) => setForm({
        title: mod.title ?? "",
        slug: mod.slug ?? "",
        description: mod.description ?? "",
        difficulty: mod.difficulty ?? "EASY",
        displayOrder: mod.displayOrder ?? 1,
        imageUrl: mod.imageUrl ?? "",
      }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-generate slug from title when creating
      if (field === "title" && !isEdit) next.slug = toSlug(value);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        displayOrder: parseInt(form.displayOrder, 10),
        imageUrl: form.imageUrl || null,
      };
      if (isEdit) {
        await modulesApi.update(id, payload);
      } else {
        await modulesApi.create(payload);
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
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-cyber-muted mb-6 animate-in">
          <Link to="/admin" className="hover:text-cyber-accent transition-colors">Admin</Link>
          <span>/</span>
          <span className="text-cyber-subtext">{isEdit ? "Edit module" : "New module"}</span>
        </div>

        <h1 className="font-display font-bold text-2xl text-cyber-text tracking-tight mb-6 animate-in">
          {isEdit ? "Edit module" : "Create module"}
        </h1>

        <form onSubmit={handleSubmit} className="card p-6 space-y-5 animate-in">
          <Alert type="error" message={error} />

          {/* Title */}
          <div>
            <label className="block text-xs font-display font-medium text-cyber-subtext mb-1.5 uppercase tracking-wide">
              Title <span className="text-red-500">*</span>
            </label>
            <input className="input" placeholder="e.g. Linux Fundamentals"
              value={form.title} onChange={set("title")} required />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-display font-medium text-cyber-subtext mb-1.5 uppercase tracking-wide">
              Slug <span className="text-red-500">*</span>
            </label>
            <input className="input" placeholder="e.g. linux-fundamentals"
              value={form.slug} onChange={set("slug")} required />
            <p className="text-xs text-cyber-muted mt-1 font-mono">
              URL-friendly identifier. Auto-generated from title.
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-display font-medium text-cyber-subtext mb-1.5 uppercase tracking-wide">
              Description
            </label>
            <textarea className="input resize-none" rows={3}
              placeholder="Brief description of what students will learn..."
              value={form.description} onChange={set("description")} />
          </div>

          {/* Difficulty + Order row */}
          <div className="grid grid-cols-2 gap-4">
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
                Display order
              </label>
              <input type="number" className="input" min={1}
                value={form.displayOrder} onChange={set("displayOrder")} />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-display font-medium text-cyber-subtext mb-1.5 uppercase tracking-wide">
              Image URL
            </label>
            <input className="input" placeholder="https://... (optional)"
              value={form.imageUrl} onChange={set("imageUrl")} />
          </div>

          {/* Preview */}
          {form.imageUrl && (
            <div>
              <p className="text-xs text-cyber-muted mb-1.5 font-mono">Preview</p>
              <img src={form.imageUrl} alt="preview"
                className="w-full h-32 object-cover rounded-lg border border-cyber-border opacity-80" />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="btn-primary flex items-center gap-2">
              {saving ? <Spinner size="sm" /> : null}
              {saving ? "Saving..." : isEdit ? "Save changes" : "Create module"}
            </button>
            <Link to="/admin" className="btn-ghost">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
