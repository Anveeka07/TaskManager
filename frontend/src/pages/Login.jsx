import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";
import getErrorMessage from "../utils/getErrorMessage";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      <div style={styles.card}>
        <div style={styles.header}>
          <span className="material-icons" style={styles.headerIcon}>login</span>
          <h1 style={styles.title}>Login</h1>
        </div>

        {error ? <div style={styles.error}>{error}</div> : null}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.footerText}>
          New here? <Link to="/register" style={styles.link}>Create account</Link>
        </p>
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
    padding: "20px",
    background: "#f3f4f6",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "26px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "18px",
  },
  headerIcon: {
    color: "#1d4ed8",
  },
  title: {
    margin: 0,
    fontSize: "28px",
    color: "#111827",
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
    fontWeight: 500,
  },
  input: {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    padding: "11px 12px",
    fontSize: "15px",
  },
  button: {
    width: "100%",
    marginTop: "6px",
    border: "none",
    borderRadius: "6px",
    padding: "11px 12px",
    fontWeight: 600,
    backgroundColor: "#1d4ed8",
    color: "white",
    cursor: "pointer",
  },
  footerText: {
    margin: "14px 0 0",
    textAlign: "center",
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
