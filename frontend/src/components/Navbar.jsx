import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <div style={styles.logo}>
          <span className="material-icons" style={styles.logoIcon}>
            fact_check
          </span>
          <span style={styles.logoText}>Task Manager</span>
        </div>

        <div style={styles.rightSection}>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>{(user?.name || "U").charAt(0).toUpperCase()}</div>
            <span style={styles.userName} className="navbar-username">
              {user?.name}
            </span>
          </div>

          <button onClick={handleLogout} style={styles.logoutButton}>
            <span className="material-icons" style={styles.buttonIcon}>
              logout
            </span>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: "white",
    boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    width: "100%",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "14px clamp(16px, 4vw, 24px)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flex: "0 0 auto",
  },
  logoIcon: {
    fontSize: "24px",
    color: "#2e7d32",
  },
  logoText: {
    fontSize: "clamp(16px, 3.5vw, 20px)",
    fontWeight: 600,
    color: "#1f2937",
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flex: "0 0 auto",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#2e7d32",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    fontWeight: 600,
  },
  userName: {
    fontSize: "14px",
    color: "#374151",
    fontWeight: 500,
    display: "none",
  },
  logoutButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    minHeight: "36px",
  },
  buttonIcon: {
    fontSize: "16px",
  },
};

export default Navbar;
