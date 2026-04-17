import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert, Spinner } from "../components/ui";

export default function RegisterPage() {
  const { register, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const ok = await register(form.username, form.email, form.password);
    setLoading(false);
    if (ok) navigate("/dashboard");
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center px-4">
      <div className="scanline" />

      <div className="w-full max-w-sm animate-in">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 rounded-xl bg-cyber-accent/10 border border-cyber-accent/20 items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-cyber-accent fill-current">
              <path d="M12 1L3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5l-9-4z"/>
            </svg>
          </div>
          <h1 className="font-display font-bold text-2xl text-cyber-text tracking-tight">
            Create account
          </h1>
          <p className="text-cyber-subtext text-sm mt-1">
            Start your cybersecurity training
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          <Alert type="error" message={error} />

          <div>
            <label className="block text-xs font-display font-medium text-cyber-subtext mb-1.5 uppercase tracking-wide">
              Username
            </label>
            <input className="input" placeholder="your_handle" value={form.username}
              onChange={set("username")} required minLength={3} maxLength={30} />
          </div>

          <div>
            <label className="block text-xs font-display font-medium text-cyber-subtext mb-1.5 uppercase tracking-wide">
              Email
            </label>
            <input type="email" className="input" placeholder="you@example.com"
              value={form.email} onChange={set("email")} required />
          </div>

          <div>
            <label className="block text-xs font-display font-medium text-cyber-subtext mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <input type="password" className="input" placeholder="min 8 characters"
              value={form.password} onChange={set("password")} required minLength={8} />
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
            {loading ? <Spinner size="sm" /> : null}
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-cyber-subtext text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-cyber-accent hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
