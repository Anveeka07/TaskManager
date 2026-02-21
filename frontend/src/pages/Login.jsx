import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import getErrorMessage from "../utils/getErrorMessage";
import loginSideIllustration from "../assets/login-side-illustration.svg";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCompact, setIsCompact] = useState(() => window.innerWidth < 900);

  useEffect(() => {
    const onResize = () => setIsCompact(window.innerWidth < 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      login(response.data.user, response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(getErrorMessage(err, "Unable to login"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={{ ...styles.shell, ...(isCompact ? styles.shellCompact : {}) }}>
        <section style={{ ...styles.leftPanel, ...(isCompact ? styles.leftPanelCompact : {}) }}>
          <div style={styles.brandRow}>
            <span className="material-icons" style={styles.brandIcon}>task_alt</span>
            <span style={styles.brandText}>Task Manager</span>
          </div>

          <div style={styles.leftContent}>
            <h2 style={styles.leftTitle}>Manage your tasks the smart way</h2>
            <p style={styles.leftSubtitle}>
              Track pending work, update progress, and keep everything in one place.
            </p>
          </div>

          <div style={styles.leftVisual}>
            <div style={styles.leftVisualGlow}></div>
            <img
              src={loginSideIllustration}
              alt="Workspace illustration"
              style={styles.leftVisualImage}
            />
          </div>
        </section>

        <section style={{ ...styles.rightPanel, ...(isCompact ? styles.rightPanelCompact : {}) }}>
          <div style={styles.hero}>
            <h1 style={{ ...styles.title, ...(isCompact ? styles.titleCompact : {}) }}>Login</h1>
            <p style={styles.subtitle}>Use your email and password to continue.</p>
          </div>

          {error ? <div style={styles.error}>{error}</div> : null}

          <form onSubmit={handleSubmit}>
            <div style={styles.field}>
              <label style={styles.label}>Email</label>
              <div style={styles.inputWrap}>
                <span className="material-icons" style={styles.inputIcon}>mail</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrap}>
                <span className="material-icons" style={styles.inputIcon}>key</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
              <span className="material-icons" style={styles.buttonIcon}>
                {loading ? "hourglass_top" : "login"}
              </span>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p style={styles.footerText}>
            Don&apos;t have an account? <Link to="/register" style={styles.link}>Create account</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px 14px",
    background: "#eef2ff",
  },
  shell: {
    width: "100%",
    maxWidth: "980px",
    minHeight: "620px",
    display: "grid",
    gridTemplateColumns: "minmax(260px, 380px) minmax(320px, 1fr)",
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 18px 38px rgba(30, 64, 175, 0.12)",
  },
  shellCompact: {
    gridTemplateColumns: "1fr",
    minHeight: "auto",
    maxWidth: "460px",
  },
  leftPanel: {
    background: "linear-gradient(170deg, #3b82f6 0%, #1d4ed8 100%)",
    color: "#fff",
    padding: "30px 26px",
    display: "flex",
    flexDirection: "column",
  },
  leftPanelCompact: {
    display: "none",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "34px",
  },
  brandIcon: {
    fontSize: "22px",
    color: "#dbeafe",
  },
  brandText: {
    fontSize: "20px",
    fontWeight: 700,
    letterSpacing: "0.2px",
  },
  leftContent: {
    marginTop: "8px",
  },
  leftTitle: {
    margin: "0 0 12px",
    fontSize: "36px",
    lineHeight: 1.15,
  },
  leftSubtitle: {
    margin: 0,
    color: "#dbeafe",
    fontSize: "15px",
    lineHeight: 1.6,
    maxWidth: "280px",
  },
  leftVisual: {
    marginTop: "auto",
    minHeight: "200px",
    paddingTop: "20px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    position: "relative",
  },
  leftVisualGlow: {
    position: "absolute",
    width: "220px",
    height: "220px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 70%)",
    bottom: "8px",
  },
  leftVisualImage: {
    width: "74%",
    maxWidth: "250px",
    height: "auto",
    objectFit: "contain",
    display: "block",
    filter: "drop-shadow(0 10px 20px rgba(15, 23, 42, 0.2))",
    position: "relative",
    zIndex: 1,
  },
  rightPanel: {
    padding: "42px 44px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  rightPanelCompact: {
    padding: "28px 18px 24px",
  },
  hero: {
    marginBottom: "18px",
  },
  title: {
    margin: "0 0 6px 0",
    fontSize: "42px",
    color: "#111827",
  },
  titleCompact: {
    fontSize: "34px",
  },
  subtitle: {
    margin: 0,
    color: "#6b7280",
    fontSize: "15px",
  },
  error: {
    background: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    padding: "10px 11px",
    borderRadius: "6px",
    marginBottom: "14px",
    fontSize: "14px",
  },
  field: { marginBottom: "14px" },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    color: "#374151",
    fontWeight: 600,
  },
  inputWrap: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #d1d5db",
    borderRadius: "9px",
    paddingLeft: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgba(15, 23, 42, 0.06)",
  },
  inputIcon: {
    fontSize: "18px",
    color: "#64748b",
  },
  input: {
    width: "100%",
    border: "none",
    borderRadius: "9px",
    padding: "12px 12px 12px 8px",
    fontSize: "15px",
    backgroundColor: "transparent",
  },
  button: {
    width: "100%",
    marginTop: "8px",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    border: "none",
    borderRadius: "999px",
    padding: "12px",
    fontWeight: 600,
    background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)",
    color: "white",
    cursor: "pointer",
    boxShadow: "0 8px 16px rgba(37, 99, 235, 0.3)",
  },
  buttonIcon: {
    fontSize: "18px",
  },
  footerText: {
    margin: "14px 0 0",
    textAlign: "left",
    color: "#4b5563",
    fontSize: "14px",
  },
  link: {
    color: "#1d4ed8",
    textDecoration: "none",
    fontWeight: 600,
  },
};

export default Login;
