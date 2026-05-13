import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { progressApi, modulesApi, lessonsApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { Spinner, CheckIcon } from "../components/ui";
import QuestionCard from "../components/ui/QuestionCard";

// Fetch lesson directly then load its parent module for breadcrumb
async function fetchLesson(lessonId) {
  const lesson = await lessonsApi.getById(lessonId);
  const mod = lesson.moduleId ? await modulesApi.getById(lesson.moduleId) : null;
  return { lesson, module: mod };
}

export default function LessonPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);       // { lesson, module }
  const [progress, setProgress] = useState(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const result = await fetchLesson(id);
      if (cancelled || !result) { setLoading(false); return; }
      setData(result);
      if (user && !cancelled) {
        await progressApi.startLesson(id);
      }
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [id, user]);

  const handleCorrect = useCallback((res) => {
    setCorrectCount((c) => c + 1);
    if (res.lessonCompleted) setCompleted(true);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-cyber-subtext">
        Lesson not found.
      </div>
    );
  }

  const { lesson, module: mod } = data;
  const questions = lesson.questions ?? [];
  const totalQ = questions.length;

  return (
    <div className="min-h-screen pt-14">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-cyber-muted mb-6">
          <Link to="/modules" className="hover:text-cyber-accent">Modules</Link>
          <span>/</span>
          <Link to={`/modules/${mod.id}`} className="hover:text-cyber-accent">{mod.title}</Link>
          <span>/</span>
          <span className="text-cyber-subtext">{lesson.title}</span>
        </div>

        {/* Completion banner */}
        {completed && (
          <div className="mb-6 px-5 py-4 rounded-xl border border-emerald-700/50 bg-emerald-950/30
                          flex items-center gap-3 animate-in">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <CheckIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-display font-semibold text-emerald-400 text-sm">Lesson complete!</p>
              <p className="text-xs text-emerald-600">You answered all questions correctly.</p>
            </div>
            <Link to={`/modules/${mod.id}`}
              className="ml-auto text-xs font-display text-cyber-accent hover:underline">
              Back to module →
            </Link>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left: lesson content */}
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h1 className="font-display font-bold text-2xl text-cyber-text tracking-tight mb-2">
                {lesson.title}
              </h1>
              <div className="flex items-center gap-4 text-xs font-mono text-cyber-muted">
                {lesson.estimatedMinutes && <span>~{lesson.estimatedMinutes} min</span>}
                <span>{totalQ} question{totalQ !== 1 ? "s" : ""}</span>
                <span>{lesson.points ?? 0} pts</span>
              </div>
            </div>

            {/* Markdown content */}
            <div className="card p-6 prose-custom">
              {lesson.content ? (
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="font-display font-bold text-xl text-cyber-text mb-3 mt-6 first:mt-0">{children}</h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="font-display font-semibold text-lg text-cyber-text mb-2 mt-5">{children}</h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="font-display font-medium text-base text-cyber-text mb-2 mt-4">{children}</h3>
                    ),
                    p: ({ children }) => (
                      <p className="text-cyber-subtext text-sm leading-relaxed mb-3">{children}</p>
                    ),
                    code: ({ inline, children }) =>
                      inline
                        ? <code className="font-mono text-cyber-accent bg-cyber-surface px-1.5 py-0.5 rounded text-xs">{children}</code>
                        : <pre className="bg-cyber-surface border border-cyber-border rounded-lg p-4 overflow-x-auto mb-4">
                            <code className="font-mono text-xs text-cyber-text">{children}</code>
                          </pre>,
                    ul: ({ children }) => <ul className="list-disc list-inside text-cyber-subtext text-sm space-y-1 mb-3">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside text-cyber-subtext text-sm space-y-1 mb-3">{children}</ol>,
                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-2 border-cyber-accent pl-4 text-cyber-muted text-sm italic mb-3">{children}</blockquote>
                    ),
                    strong: ({ children }) => <strong className="text-cyber-text font-medium">{children}</strong>,
                    a: ({ href, children }) => (
                      <a href={href} className="text-cyber-accent hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>
                    ),
                  }}
                >
                  {lesson.content}
                </ReactMarkdown>
              ) : (
                <p className="text-cyber-muted text-sm italic">No content for this lesson yet.</p>
              )}
            </div>
          </div>

          {/* Right: questions panel */}
          {totalQ > 0 && (
            <div className="lg:w-96 flex-shrink-0">
              <div className="sticky top-20">
                {/* Progress header */}
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-display font-semibold text-cyber-text text-sm">
                    Questions
                  </h2>
                  <span className="font-mono text-xs text-cyber-muted">
                    {correctCount}/{totalQ} correct
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1 bg-cyber-border rounded-full mb-4 overflow-hidden">
                  <div className="progress-bar"
                    style={{ width: `${totalQ > 0 ? (correctCount / totalQ) * 100 : 0}%` }} />
                </div>

                {/* Question cards */}
                <div className="space-y-3 max-h-[calc(100vh-140px)] overflow-y-auto pr-1">
                  {questions.map((q) => (
                    <QuestionCard key={q.id} question={q} onCorrect={handleCorrect} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}