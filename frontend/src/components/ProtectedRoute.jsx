import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={styles.loaderWrap}>
        <span className="material-icons" style={styles.loaderIcon}>hourglass_top</span>
        Checking session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

const styles = {
  loaderWrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    color: "#4b5563",
    fontSize: "16px",
  },
  loaderIcon: {
    fontSize: "18px",
  },
};

export default ProtectedRoute;
