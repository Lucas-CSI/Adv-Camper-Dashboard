import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert, Spinner } from "../components/ui";

export default function LoginPage() {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(form.username, form.password);
    setLoading(false);
    if (ok) navigate("/dashboard");
  };

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center px-4">
      <div className="scanline" />

      <div className="w-full max-w-sm animate-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-cyber-accent/10 border border-cyber-accent/20 items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-cyber-accent fill-current">
              <path d="M12 1L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4z"/>
            </svg>
          </div>
          <h1 className="font-display font-bold text-2xl text-cyber-text tracking-tight">
            Welcome back
          </h1>
          <p className="text-cyber-subtext text-sm mt-1">
            Continue your security journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <Alert type="error" message={error} />

          <div>
            <label className="block text-xs font-display font-medium text-cyber-subtext mb-1.5 uppercase tracking-wide">
              Username
            </label>
            <input
              className="input"
              placeholder="your_handle"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-display font-medium text-cyber-subtext mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
            {loading ? <Spinner size="sm" /> : null}
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        <p className="text-center text-cyber-subtext text-sm mt-4">
          No account?{" "}
          <Link to="/register" className="text-cyber-accent hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
