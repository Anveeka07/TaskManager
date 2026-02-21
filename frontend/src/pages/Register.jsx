import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import getErrorMessage from "../utils/getErrorMessage";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (form.password.length < 6) {
      setError("Password should be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      setSuccess("Account created. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(getErrorMessage(err, "Unable to register"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <span className="material-icons" style={styles.headerIcon}>person_add</span>
          <h1 style={styles.title}>Create account</h1>
        </div>

        {error ? <div style={styles.error}>{error}</div> : null}
        {success ? <div style={styles.success}>{success}</div> : null}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Name</label>
            <input value={form.name} onChange={(e) => setField("name", e.target.value)} style={styles.input} />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} style={styles.input} />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input type="password" value={form.password} onChange={(e) => setField("password", e.target.value)} style={styles.input} />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Confirm password</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setField("confirmPassword", e.target.value)}
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Login</Link>
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
    maxWidth: "440px",
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
    color: "#2e7d32",
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
  success: {
    background: "#ecfdf3",
    color: "#166534",
    border: "1px solid #86efac",
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
    backgroundColor: "#2e7d32",
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

export default Register;
