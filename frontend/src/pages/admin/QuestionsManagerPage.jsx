import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { questionsApi, lessonsApi } from "../../services/api";
import { Spinner, Alert, CheckIcon, XIcon } from "../../components/ui";

const TYPES = ["FREE_TEXT", "MULTIPLE_CHOICE", "FLAG_SUBMISSION"];

const emptyQuestion = {
  text: "",
  type: "FREE_TEXT",
  correctAnswer: "",
  explanation: "",
  hint: "",
  points: 10,
  displayOrder: 1,
  options: "",   // JSON array string for MULTIPLE_CHOICE
};

function QuestionRow({ question, onEdit, onDelete, deleting }) {
  return (
    <div className="card p-4 flex items-start gap-4 group">
      <div className="w-8 h-8 rounded-lg bg-cyber-surface border border-cyber-border
                      flex items-center justify-center flex-shrink-0 font-display font-bold text-sm text-cyber-muted">
        {question.displayOrder}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-medium text-cyber-text text-sm leading-snug">
          {question.text}
        </p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="font-mono text-xs text-cyber-muted">{question.type}</span>
          <span className="font-mono text-xs text-cyber-accent">{question.points} pts</span>
          {question.hint && (
            <span className="text-xs text-amber-500 font-mono">has hint</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <button onClick={() => onEdit(question)}
          className="text-xs font-display text-cyber-subtext hover:text-cyber-text transition-colors">
          Edit
        </button>
        <button onClick={() => onDelete(question)} disabled={deleting === question.id}
          className="text-xs font-display text-red-500 hover:text-red-400 transition-colors disabled:opacity-40">
          {deleting === question.id ? "..." : "Delete"}
        </button>
      </div>
    </div>
  );
}

function QuestionForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || emptyQuestion);
  const [error, setError] = useState(null);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const options = form.type === "MULTIPLE_CHOICE"
    ? (() => { try { return JSON.parse(form.options || "[]"); } catch { return []; } })()
    : [];

  const setOption = (i, val) => {
    const arr = [...options];
    arr[i] = val;
    setForm((f) => ({ ...f, options: JSON.stringify(arr) }));
  };

  const addOption = () => {
    setForm((f) => ({ ...f, options: JSON.stringify([...options, ""]) }));
  };

  const removeOption = (i) => {
    const arr = options.filter((_, idx) => idx !== i);
    setForm((f) => ({ ...f, options: JSON.stringify(arr) }));
  };

  const handleSave = () => {
    if (!form.text || !form.correctAnswer) {
      setError("Question text and correct answer are required.");
      return;
    }
    setError(null);
    onSave({ ...form, points: parseInt(form.points, 10), displayOrder: parseInt(form.displayOrder, 10) });
  };

  return (
    <div className="card p-5 border-cyber-accent/30 space-y-4">
      <h3 className="font-display font-semibold text-cyber-text text-sm">
        {initial?.id ? "Edit question" : "New question"}
      </h3>

      <Alert type="error" message={error} />

      {/* Question text */}
      <div>
        <label className="block text-xs font-display font-medium text-cyber-subtext mb-1.5 uppercase tracking-wide">
          Question <span className="text-red-500">*</span>
        </label>
        <textarea className="input resize-none" rows={2}
          placeholder="What is the purpose of the /etc/passwd file?"
          value={form.text} onChange={set("text")} />
      </div>

      {/* Type + Order + Points row */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-display font-medium text-cyber-subtext mb-1.5 uppercase tracking-wide">
            Type
          </label>
          <select className="input" value={form.type} onChange={set("type")}>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t.replace("_", " ")}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-display font-medium text-cyber-subtext mb-1.5 uppercase tracking-wide">
            Points
          </label>
          <input type="number" className="input" min={0}
            value={form.points} onChange={set("points")} />
        </div>
        <div>
          <label className="block text-xs font-display font-medium text-cyber-subtext mb-1.5 uppercase tracking-wide">
            Order
          </label>
          <input type="number" className="input" min={1}
            value={form.displayOrder} onChange={set("displayOrder")} />
        </div>
      </div>

      {/* Multiple choice options */}
      {form.type === "MULTIPLE_CHOICE" && (
        <div>
          <label className="block text-xs font-display font-medium text-cyber-subtext mb-1.5 uppercase tracking-wide">
            Options
          </label>
          <div className="space-y-2">
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="font-display text-xs text-cyber-muted w-5 flex-shrink-0">
                  {String.fromCharCode(65 + i)}.
                </span>
                <input className="input flex-1" placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  value={opt} onChange={(e) => setOption(i, e.target.value)} />
                <button type="button" onClick={() => removeOption(i)}
                  className="text-cyber-muted hover:text-red-400 transition-colors">
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button type="button" onClick={addOption}
              className="text-xs font-display text-cyber-accent hover:underline">
              + Add option
            </button>
          </div>
        </div>
      )}

      {/* Correct answer */}
      <div>
        <label className="block text-xs font-display font-medium text-cyber-subtext mb-1.5 uppercase tracking-wide">
          Correct answer <span className="text-red-500">*</span>
        </label>
        {form.type === "MULTIPLE_CHOICE" ? (
          <select className="input" value={form.correctAnswer} onChange={set("correctAnswer")}>
            <option value="">Select correct option...</option>
            {options.map((opt, i) => (
              <option key={i} value={opt}>{String.fromCharCode(65 + i)}. {opt}</option>
            ))}
          </select>
        ) : (
          <input className="input font-mono"
            placeholder={form.type === "FLAG_SUBMISSION" ? "THM{answer_here}" : "Exact answer..."}
            value={form.correctAnswer} onChange={set("correctAnswer")} />
        )}
        <p className="text-xs text-cyber-muted mt-1 font-mono">
          Never shown to students — validated server-side only.
        </p>
      </div>

      {/* Explanation */}
      <div>
        <label className="block text-xs font-display font-medium text-cyber-subtext mb-1.5 uppercase tracking-wide">
          Explanation <span className="text-cyber-muted normal-case font-normal">(shown after answering)</span>
        </label>
        <textarea className="input resize-none" rows={2}
          placeholder="Explain why this is the correct answer..."
          value={form.explanation} onChange={set("explanation")} />
      </div>

      {/* Hint */}
      <div>
        <label className="block text-xs font-display font-medium text-cyber-subtext mb-1.5 uppercase tracking-wide">
          Hint <span className="text-cyber-muted normal-case font-normal">(shown after 2 wrong attempts)</span>
        </label>
        <input className="input"
          placeholder="A subtle nudge in the right direction..."
          value={form.hint} onChange={set("hint")} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-1">
        <button type="button" onClick={handleSave} disabled={saving}
          className="btn-primary flex items-center gap-2">
          {saving ? <Spinner size="sm" /> : <CheckIcon className="w-4 h-4" />}
          {saving ? "Saving..." : "Save question"}
        </button>
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function QuestionsManagerPage() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [editing, setEditing] = useState(null);   // null | emptyQuestion | existing question
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      const [les, qs] = await Promise.all([
        lessonsApi.getById(lessonId),
        questionsApi.getByLesson(lessonId),
      ]);
      setLesson(les);
      setQuestions((qs || []).sort((a, b) => a.displayOrder - b.displayOrder));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [lessonId]);

  const handleSave = async (form) => {
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form, lesson: { id: parseInt(lessonId, 10) } };
      if (form.id) {
        const updated = await questionsApi.update(form.id, payload);
        setQuestions((prev) => prev.map((q) => q.id === form.id ? updated : q));
      } else {
        const created = await questionsApi.create(payload);
        setQuestions((prev) => [...prev, created].sort((a, b) => a.displayOrder - b.displayOrder));
      }
      setEditing(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (question) => {
    if (!window.confirm(`Delete this question? This cannot be undone.`)) return;
    setDeleting(question.id);
    try {
      await questionsApi.delete(question.id);
      setQuestions((prev) => prev.filter((q) => q.id !== question.id));
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(null);
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
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-cyber-muted mb-6 animate-in">
          <Link to="/admin" className="hover:text-cyber-accent transition-colors">Admin</Link>
          <span>/</span>
          <Link to={`/admin/lessons/${lessonId}/edit`}
            className="hover:text-cyber-accent transition-colors">
            {lesson?.title ?? "Lesson"}
          </Link>
          <span>/</span>
          <span className="text-cyber-subtext">Questions</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 animate-in">
          <div>
            <h1 className="font-display font-bold text-2xl text-cyber-text tracking-tight">
              Questions
            </h1>
            <p className="text-cyber-subtext text-sm mt-0.5">
              {lesson?.title} · {questions.length} question{questions.length !== 1 ? "s" : ""}
            </p>
          </div>
          {!editing && (
            <button onClick={() => setEditing({
              ...emptyQuestion,
              displayOrder: questions.length + 1
            })}
              className="btn-primary flex items-center gap-2">
              <span className="text-lg leading-none">+</span> Add question
            </button>
          )}
        </div>

        <Alert type="error" message={error} />

        {/* New question form */}
        {editing && !editing.id && (
          <div className="mb-4 animate-in">
            <QuestionForm
              initial={editing}
              onSave={handleSave}
              onCancel={() => setEditing(null)}
              saving={saving}
            />
          </div>
        )}

        {/* Questions list */}
        <div className="space-y-3">
          {questions.length === 0 && !editing && (
            <div className="card p-12 text-center text-cyber-subtext">
              <p className="font-display mb-2">No questions yet.</p>
              <button onClick={() => setEditing(emptyQuestion)}
                className="btn-primary inline-flex">
                Add your first question
              </button>
            </div>
          )}

          {questions.map((q) =>
            editing?.id === q.id ? (
              <div key={q.id} className="animate-in">
                <QuestionForm
                  initial={editing}
                  onSave={handleSave}
                  onCancel={() => setEditing(null)}
                  saving={saving}
                />
              </div>
            ) : (
              <div key={q.id} className="animate-in">
                <QuestionRow
                  question={q}
                  onEdit={(q) => setEditing(q)}
                  onDelete={handleDelete}
                  deleting={deleting}
                />
              </div>
            )
          )}
        </div>

        {/* Bottom nav */}
        <div className="mt-8 flex items-center gap-3">
          <Link to={`/admin/lessons/${lessonId}/edit`} className="btn-ghost text-xs">
            ← Back to lesson
          </Link>
          <Link to="/admin" className="btn-ghost text-xs">
            Admin home
          </Link>
        </div>
      </div>
    </div>
  );
}
