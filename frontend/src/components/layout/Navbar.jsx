import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cyber-border bg-cyber-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-cyber-accent flex items-center justify-center">
            <svg viewBox="0 0 16 16" className="w-4 h-4 text-cyber-bg fill-current">
              <path d="M8 1L2 4v4c0 3.3 2.5 6.4 6 7 3.5-.6 6-3.7 6-7V4L8 1z"/>
            </svg>
          </div>
          <span className="font-display font-bold text-cyber-text text-sm tracking-wide group-hover:text-cyber-accent transition-colors">
            HackPath
          </span>
        </Link>

        {/* Nav links */}
        {user && (
          <div className="hidden md:flex items-center gap-6">
            <Link to="/dashboard"
              className={`nav-link ${isActive("/dashboard") ? "text-cyber-accent" : ""}`}>
              Dashboard
            </Link>
            <Link to="/modules"
              className={`nav-link ${isActive("/modules") ? "text-cyber-accent" : ""}`}>
              Modules
            </Link>
            {user.role === "ROLE_ADMIN" && (
              <Link to="/admin"
                className={`nav-link ${isActive("/admin") ? "text-cyber-accent" : ""}`}>
                <span className="badge bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/30">
                  Admin
                </span>
              </Link>
            )}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="text-cyber-subtext font-mono">{user.username}</span>
                <span className="text-cyber-accent font-display font-semibold">
                  {user.totalPoints ?? 0} pts
                </span>
              </div>
              <button onClick={handleLogout}
                className="btn-ghost text-xs px-4 py-2">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-xs px-4 py-2">Login</Link>
              <Link to="/register" className="btn-primary text-xs px-4 py-2">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
