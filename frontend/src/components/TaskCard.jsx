import React from "react";

const statusMap = {
  Completed: { bg: "#e8f5e9", fg: "#2e7d32", border: "#81c784" },
  "In Progress": { bg: "#fff3e0", fg: "#e65100", border: "#ffb74d" },
  Pending: { bg: "#ffebee", fg: "#c62828", border: "#e57373" },
};

const priorityMap = {
  High: {
    color: "#b91c1c",
    label: "High",
    bg: "rgba(220, 38, 38, 0.12)",
    border: "rgba(220, 38, 38, 0.35)",
  },
  Medium: {
    color: "#a16207",
    label: "Medium",
    bg: "rgba(245, 158, 11, 0.18)",
    border: "rgba(245, 158, 11, 0.4)",
  },
  Low: {
    color: "#166534",
    label: "Low",
    bg: "rgba(34, 197, 94, 0.14)",
    border: "rgba(34, 197, 94, 0.35)",
  },
};

function TaskCard({ task, onEdit, onDelete }) {
  const status = task.status || "Pending";
  const priority = task.priority || "Medium";

  const statusUi = statusMap[status] || statusMap.Pending;
  const priorityUi = priorityMap[priority] || priorityMap.Medium;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title} title={task.title}>{task.title}</h3>
        <div
          style={{
            ...styles.priorityChip,
            backgroundColor: priorityUi.bg,
            borderColor: priorityUi.border,
          }}
          title={`Priority: ${priorityUi.label}`}
        >
          <span className="material-icons" style={{ ...styles.priorityIcon, color: priorityUi.color }}>
            flag
          </span>
          <span style={{ ...styles.priorityText, color: priorityUi.color }}>{priorityUi.label}</span>
        </div>
      </div>

      <p style={styles.description} title={task.description || ""}>
        {task.description || "No description"}
      </p>

      <div
        style={{
          ...styles.statusBadge,
          backgroundColor: statusUi.bg,
          color: statusUi.fg,
          border: `1px solid ${statusUi.border}`,
        }}
      >
        <span className="material-icons" style={styles.statusIcon}>
          fiber_manual_record
        </span>
        {status}
      </div>

      <div style={styles.actions}>
        <button onClick={() => onEdit(task)} style={styles.editButton} className="task-edit-btn">
          <span className="material-icons" style={styles.actionIcon}>edit</span>
          Edit
        </button>
        <button onClick={() => onDelete(task._id)} style={styles.deleteButton} className="task-delete-btn">
          <span className="material-icons" style={styles.actionIcon}>delete</span>
          Delete
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: "white",
    borderRadius: "10px",
    padding: "18px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    height: "280px",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "8px",
    marginBottom: "10px",
  },
  title: {
    margin: 0,
    fontSize: "20px",
    lineHeight: 1.3,
    color: "#1f2937",
    flex: 1,
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },
  priorityChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "999px",
    padding: "4px 8px",
    whiteSpace: "nowrap",
  },
  priorityIcon: {
    fontSize: "16px",
  },
  priorityText: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#374151",
  },
  description: {
    margin: "0 0 14px 0",
    color: "#4b5563",
    fontSize: "14px",
    lineHeight: 1.6,
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 3,
    WebkitBoxOrient: "vertical",
    minHeight: "67px",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    padding: "6px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "14px",
    width: "fit-content",
  },
  statusIcon: {
    fontSize: "10px",
  },
  actions: {
    display: "flex",
    gap: "10px",
    paddingTop: "12px",
    borderTop: "1px solid #f3f4f6",
    marginTop: "auto",
  },
  actionIcon: {
    fontSize: "16px",
  },
  editButton: {
    flex: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "9px 10px",
    backgroundColor: "rgba(29, 78, 216, 0.1)",
    color: "#1e40af",
    border: "1px solid rgba(29, 78, 216, 0.35)",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(29, 78, 216, 0.12)",
  },
  deleteButton: {
    flex: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "9px 10px",
    backgroundColor: "rgba(220, 38, 38, 0.08)",
    color: "#b91c1c",
    border: "1px solid rgba(220, 38, 38, 0.3)",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 1px 2px rgba(220, 38, 38, 0.12)",
  },
};

export default TaskCard;
