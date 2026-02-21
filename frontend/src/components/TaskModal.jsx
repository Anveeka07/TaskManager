import React, { useEffect, useState } from "react";

function TaskModal({ isOpen, onClose, onSave, taskToEdit }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (taskToEdit) {
      setForm({
        title: taskToEdit.title || "",
        description: taskToEdit.description || "",
        status: taskToEdit.status || "Pending",
        priority: taskToEdit.priority || "Medium",
      });
    } else {
      setForm({ title: "", description: "", status: "Pending", priority: "Medium" });
    }

    setError("");
  }, [isOpen, taskToEdit]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const title = form.title.trim();
    if (!title) {
      setError("Title is required");
      return;
    }
    if (title.length < 3) {
      setError("Title should be at least 3 characters");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...form,
        title,
        description: form.description.trim(),
      });
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>{taskToEdit ? "Edit Task" : "Add Task"}</h2>
          <button type="button" style={styles.closeButton} onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        {error ? <div style={styles.errorBox}>{error}</div> : null}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. Prepare sprint demo"
              style={styles.input}
              disabled={saving}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Optional details"
              style={styles.textarea}
              rows="4"
              disabled={saving}
            />
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Status</label>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                style={styles.select}
                disabled={saving}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Priority</label>
              <select
                value={form.priority}
                onChange={(e) => updateField("priority", e.target.value)}
                style={styles.select}
                disabled={saving}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelButton} disabled={saving}>
              Cancel
            </button>
            <button type="submit" style={styles.submitButton} disabled={saving}>
              {saving ? "Saving..." : taskToEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1200,
    padding: "16px",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: "10px",
    width: "100%",
    maxWidth: "520px",
    maxHeight: "92vh",
    overflowY: "auto",
    padding: "20px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.15)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },
  title: { margin: 0, fontSize: "26px", color: "#1f2937" },
  closeButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#6b7280",
    display: "inline-flex",
    alignItems: "center",
  },
  errorBox: {
    marginBottom: "14px",
    border: "1px solid #fca5a5",
    color: "#b91c1c",
    background: "#fef2f2",
    borderRadius: "6px",
    padding: "9px 10px",
    fontSize: "14px",
  },
  formGroup: { marginBottom: "16px", flex: 1 },
  label: {
    display: "block",
    marginBottom: "7px",
    color: "#4b5563",
    fontWeight: 600,
    fontSize: "14px",
  },
  input: {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    padding: "11px 12px",
    fontSize: "15px",
  },
  textarea: {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    padding: "11px 12px",
    fontSize: "15px",
    resize: "vertical",
    fontFamily: "inherit",
  },
  select: {
    width: "100%",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    padding: "11px 12px",
    fontSize: "15px",
    backgroundColor: "white",
  },
  row: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "6px",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "none",
    borderRadius: "6px",
    padding: "11px 12px",
    fontWeight: 600,
    cursor: "pointer",
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "11px 12px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default TaskModal;
