import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskModal from "../components/TaskModal";
import api from "../utils/api";
import getErrorMessage from "../utils/getErrorMessage";

function Dashboard() {
  const { user } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get("/tasks");
        setTasks(data);
      } catch (error) {
        setPageError(getErrorMessage(error, "Could not load tasks"));
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const counts = useMemo(() => {
    const summary = {
      total: tasks.length,
      pending: 0,
      inProgress: 0,
      completed: 0,
    };

    tasks.forEach((task) => {
      if (task.status === "Pending") summary.pending += 1;
      if (task.status === "In Progress") summary.inProgress += 1;
      if (task.status === "Completed") summary.completed += 1;
    });

    return summary;
  }, [tasks]);

  const visibleTasks = useMemo(() => {
    let list = filter === "All" ? [...tasks] : tasks.filter((task) => task.status === filter);

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      list = list.filter((task) => (task.title || "").toLowerCase().includes(query));
    }

    const priorityRank = { High: 3, Medium: 2, Low: 1 };

    if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (sortBy === "priority-high") {
      list.sort((a, b) => (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0));
    } else if (sortBy === "priority-low") {
      list.sort((a, b) => (priorityRank[a.priority] || 0) - (priorityRank[b.priority] || 0));
    } else {
      list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return list;
  }, [tasks, filter, searchQuery, sortBy]);

  const openCreateModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(false);
  };

  const handleSaveTask = async (payload) => {
    try {
      if (taskToEdit?._id) {
        const { data } = await api.put(`/tasks/${taskToEdit._id}`, payload);
        setTasks((prev) => prev.map((item) => (item._id === taskToEdit._id ? data : item)));
      } else {
        const { data } = await api.post("/tasks", payload);
        setTasks((prev) => [data, ...prev]);
      }
    } catch (error) {
      throw new Error(getErrorMessage(error, "Failed to save task"));
    }
  };

  const askDeleteTask = (taskId) => {
    const task = tasks.find((item) => item._id === taskId);
    if (task) setTaskToDelete(task);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete?._id) return;

    setIsDeleting(true);
    try {
      await api.delete(`/tasks/${taskToDelete._id}`);
      setTasks((prev) => prev.filter((item) => item._id !== taskToDelete._id));
      setTaskToDelete(null);
    } catch (error) {
      setPageError(getErrorMessage(error, "Failed to delete task"));
    } finally {
      setIsDeleting(false);
    }
  };

  const clearSearch = () => setSearchQuery("");

  if (loading) {
    return (
      <div style={styles.loadingWrap}>
        <div style={styles.spinner}></div>
        Loading tasks...
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div style={styles.page}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.pageTitle}>Welcome back, {user?.name || "there"}</h1>
            <p style={styles.pageSubtitle}>Keep your work in one place.</p>
          </div>

          <button onClick={openCreateModal} style={styles.addButton}>
            <span style={styles.addIconWrap}>
              <span className="material-icons" style={styles.buttonIcon}>add</span>
            </span>
            New Task
          </button>
        </div>

        <div style={styles.statsGrid}>
          <StatCard
            title="Total"
            value={counts.total}
            borderColor="#2563eb"
            valueColor="#1d4ed8"
            valueBg="rgba(37, 99, 235, 0.14)"
          />
          <StatCard
            title="Pending"
            value={counts.pending}
            borderColor="#ef4444"
            valueColor="#b91c1c"
            valueBg="rgba(239, 68, 68, 0.14)"
          />
          <StatCard
            title="In Progress"
            value={counts.inProgress}
            borderColor="#f59e0b"
            valueColor="#b45309"
            valueBg="rgba(245, 158, 11, 0.18)"
          />
          <StatCard
            title="Completed"
            value={counts.completed}
            borderColor="#22c55e"
            valueColor="#15803d"
            valueBg="rgba(34, 197, 94, 0.14)"
          />
        </div>

        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>Your tasks</h2>

          <div style={styles.filtersRow}>
            <FilterButton active={filter === "All"} label={`All (${counts.total})`} onClick={() => setFilter("All")} />
            <FilterButton active={filter === "Pending"} label={`Pending (${counts.pending})`} onClick={() => setFilter("Pending")} />
            <FilterButton
              active={filter === "In Progress"}
              label={`In Progress (${counts.inProgress})`}
              onClick={() => setFilter("In Progress")}
            />
            <FilterButton
              active={filter === "Completed"}
              label={`Completed (${counts.completed})`}
              onClick={() => setFilter("Completed")}
            />
          </div>

          <div style={styles.sortRow}>
            <label style={styles.sortLabel}>Sort</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={styles.sortSelect}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="priority-high">High priority first</option>
              <option value="priority-low">Low priority first</option>
            </select>
          </div>

          <div style={styles.searchWrap} className="search-input-wrapper">
            <span className="material-icons" style={styles.searchIcon}>search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title"
              style={styles.searchInput}
            />
            {searchQuery ? (
              <button type="button" onClick={clearSearch} className="search-clear" style={styles.searchClear}>
                <span className="material-icons" style={{ fontSize: 18 }}>close</span>
              </button>
            ) : null}
          </div>

          {pageError ? <div style={styles.pageError}>{pageError}</div> : null}

          {visibleTasks.length === 0 ? (
            <div style={styles.emptyState}>
              <span className="material-icons" style={styles.emptyIcon}>
                {searchQuery ? "search_off" : "assignment"}
              </span>
              <h3 style={styles.emptyTitle}>
                {searchQuery ? "No matching tasks" : filter === "All" ? "No tasks yet" : `No ${filter.toLowerCase()} tasks`}
              </h3>
              <p style={styles.emptyText}>
                {searchQuery ? "Try a different keyword." : 'Use "Add Task" to create one.'}
              </p>
            </div>
          ) : (
            <div style={styles.cardsGrid}>
              {visibleTasks.map((task) => (
                <div key={task._id} className="task-card">
                  <TaskCard task={task} onEdit={openEditModal} onDelete={askDeleteTask} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <TaskModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSaveTask} taskToEdit={taskToEdit} />

      {taskToDelete ? (
        <div style={styles.confirmOverlay} onClick={() => setTaskToDelete(null)}>
          <div style={styles.confirmCard} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.confirmTitle}>Delete task</h3>
            <p style={styles.confirmText}>
              You are deleting <strong>{taskToDelete.title}</strong>.
            </p>
            <p style={styles.confirmWarn}>This cannot be undone.</p>
            <div style={styles.confirmActions}>
              <button type="button" style={styles.cancelBtn} onClick={() => setTaskToDelete(null)} disabled={isDeleting}>
                Cancel
              </button>
              <button type="button" style={styles.deleteBtn} onClick={confirmDeleteTask} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function StatCard({ title, value, borderColor, valueColor, valueBg }) {
  return (
    <div style={{ ...styles.statCard, borderLeft: `4px solid ${borderColor}` }}>
      <div style={{ ...styles.statValue, color: valueColor, backgroundColor: valueBg }}>{value}</div>
      <div style={styles.statTitle}>{title}</div>
    </div>
  );
}

function FilterButton({ active, label, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{ ...styles.filterButton, ...(active ? styles.filterActive : {}) }}>
      {label}
    </button>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    padding: "26px 16px 40px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  loadingWrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    color: "#4b5563",
  },
  spinner: {
    width: "18px",
    height: "18px",
    border: "3px solid #d1d5db",
    borderTop: "3px solid #2e7d32",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  pageTitle: {
    margin: "0 0 4px",
    fontSize: "30px",
    color: "#111827",
  },
  pageSubtitle: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
  },
  addButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "linear-gradient(135deg, #2e7d32 0%, #3f9b45 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "8px 14px 8px 10px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 4px 10px rgba(46, 125, 50, 0.24)",
  },
  addIconWrap: {
    width: "24px",
    height: "24px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.18)",
  },
  buttonIcon: { fontSize: "16px" },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "12px",
    marginBottom: "16px",
  },
  statCard: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "14px",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: 700,
    marginBottom: "8px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "56px",
    minHeight: "40px",
    borderRadius: "8px",
    padding: "4px 10px",
  },
  statTitle: {
    color: "#6b7280",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
  },
  panel: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "16px",
  },
  panelTitle: {
    marginTop: 0,
    marginBottom: "12px",
    fontSize: "22px",
    color: "#111827",
  },
  filtersRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "12px",
  },
  filterButton: {
    border: "1px solid #d1d5db",
    backgroundColor: "#fff",
    color: "#374151",
    padding: "8px 12px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
  filterActive: {
    backgroundColor: "#2e7d32",
    borderColor: "#2e7d32",
    color: "#fff",
  },
  sortRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
  },
  sortLabel: {
    color: "#4b5563",
    fontSize: "13px",
    fontWeight: 600,
  },
  sortSelect: {
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: "#fff",
    padding: "8px 10px",
    fontSize: "14px",
    minWidth: "220px",
  },
  searchWrap: {
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: "14px",
  },
  searchIcon: {
    color: "#6b7280",
    paddingLeft: "10px",
    fontSize: "19px",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    padding: "10px",
    fontSize: "14px",
  },
  searchClear: {
    border: "none",
    background: "transparent",
    color: "#6b7280",
    padding: "6px 8px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
  },
  pageError: {
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    padding: "8px 10px",
    fontSize: "13px",
    marginBottom: "12px",
  },
  emptyState: {
    textAlign: "center",
    border: "1px dashed #d1d5db",
    borderRadius: "8px",
    padding: "28px 16px",
  },
  emptyIcon: {
    fontSize: "38px",
    color: "#6b7280",
    marginBottom: "8px",
  },
  emptyTitle: {
    margin: "0 0 4px",
    color: "#111827",
    fontSize: "18px",
  },
  emptyText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
    gap: "12px",
    gridAutoRows: "1fr",
  },
  confirmOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    zIndex: 1300,
  },
  confirmCard: {
    width: "100%",
    maxWidth: "380px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    padding: "16px",
  },
  confirmTitle: { marginTop: 0, marginBottom: "8px", color: "#111827" },
  confirmText: { margin: "0 0 6px", color: "#374151", fontSize: "14px" },
  confirmWarn: { margin: "0 0 12px", color: "#b91c1c", fontSize: "13px" },
  confirmActions: { display: "flex", gap: "8px" },
  cancelBtn: {
    flex: 1,
    border: "none",
    borderRadius: "6px",
    padding: "10px",
    background: "#f3f4f6",
    color: "#374151",
    cursor: "pointer",
    fontWeight: 600,
  },
  deleteBtn: {
    flex: 1,
    border: "none",
    borderRadius: "6px",
    padding: "10px",
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
};

export default Dashboard;
