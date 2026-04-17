import { useState } from "react";
import { answersApi } from "../../services/api";
import { CheckIcon, XIcon, Spinner } from "../ui";

export default function QuestionCard({ question, onCorrect }) {
  const [answer, setAnswer] = useState("");
  const [selected, setSelected] = useState(null); // for multiple choice
  const [result, setResult] = useState(null);      // AnswerResponse
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const options = (() => {
    try { return question.options ? JSON.parse(question.options) : []; }
    catch { return []; }
  })();

  const isAnswered = result?.correct || false;
  const answerValue = question.type === "MULTIPLE_CHOICE" ? selected : answer;

  const handleSubmit = async () => {
    if (!answerValue) return;
    setLoading(true);
    setError(null);
    try {
      const res = await answersApi.submit(question.id, answerValue);
      setResult(res);
      if (res.correct) onCorrect?.(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`card p-5 transition-all duration-300
      ${isAnswered ? "border-emerald-800/50" : ""}
      ${result && !result.correct ? "border-red-900/50" : ""}`}>

      {/* Question text */}
      <p className="font-display font-medium text-cyber-text text-sm mb-4 leading-relaxed">
        {question.text}
      </p>

      {/* Multiple choice */}
      {question.type === "MULTIPLE_CHOICE" && (
        <div className="space-y-2 mb-4">
          {options.map((opt, i) => (
            <button key={i} onClick={() => !isAnswered && setSelected(opt)}
              disabled={isAnswered}
              className={`w-full text-left px-4 py-2.5 rounded-lg border text-sm font-mono
                transition-all duration-150
                ${selected === opt && !result ? "border-cyber-accent bg-cyber-accent/5 text-cyber-accent" : ""}
                ${result && opt === answerValue && result.correct ? "border-emerald-600 bg-emerald-950 text-emerald-400" : ""}
                ${result && opt === answerValue && !result.correct ? "border-red-700 bg-red-950 text-red-400" : ""}
                ${(!result || opt !== answerValue) && selected !== opt ? "border-cyber-border text-cyber-subtext hover:border-cyber-muted" : ""}
              `}>
              <span className="font-display text-xs mr-2 text-cyber-muted">
                {String.fromCharCode(65 + i)}.
              </span>
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Free text / Flag */}
      {(question.type === "FREE_TEXT" || question.type === "FLAG_SUBMISSION") && (
        <div className="mb-4">
          {question.type === "FLAG_SUBMISSION" && (
            <p className="text-xs font-mono text-cyber-muted mb-1.5">
              Format: THM{"{"}answer{"}"}
            </p>
          )}
          <input
            className="input"
            placeholder={question.type === "FLAG_SUBMISSION" ? "THM{...}" : "Your answer..."}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={isAnswered}
            onKeyDown={(e) => e.key === "Enter" && !isAnswered && handleSubmit()}
          />
        </div>
      )}

      {/* Hint */}
      {result?.hint && !result.correct && (
        <div className="mb-3 px-3 py-2.5 bg-amber-950/50 border border-amber-800/50 rounded-lg">
          <p className="text-xs font-mono text-amber-400">
            <span className="font-display font-medium">Hint:</span> {result.hint}
          </p>
        </div>
      )}

      {/* Explanation */}
      {result?.explanation && (
        <div className={`mb-3 px-3 py-2.5 rounded-lg border text-xs font-mono leading-relaxed
          ${result.correct
            ? "bg-emerald-950/50 border-emerald-800/50 text-emerald-400"
            : "bg-red-950/50 border-red-800/50 text-red-400"}`}>
          {result.explanation}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400 mb-3 font-mono">{error}</p>
      )}

      {/* Result banner */}
      {result && (
        <div className={`flex items-center gap-2 mb-3 text-sm font-display font-medium
          ${result.correct ? "text-emerald-400" : "text-red-400"}`}>
          {result.correct
            ? <><CheckIcon className="w-4 h-4" /> Correct! +{result.pointsAwarded} pts</>
            : <><XIcon className="w-4 h-4" /> Incorrect — try again</>}
        </div>
      )}

      {/* Submit button */}
      {!isAnswered && (
        <button onClick={handleSubmit} disabled={loading || !answerValue}
          className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
          {loading ? <Spinner size="sm" /> : null}
          {loading ? "Checking..." : "Submit"}
        </button>
      )}

      {isAnswered && (
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-500">
          <CheckIcon className="w-3.5 h-3.5" />
          Question complete
        </div>
      )}
    </div>
  );
}
