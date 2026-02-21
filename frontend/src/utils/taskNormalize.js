const statusMap = {
  pending: "Pending",
  incomplete: "Pending",
  todo: "Pending",
  "in progress": "In Progress",
  inprogress: "In Progress",
  progress: "In Progress",
  completed: "Completed",
  complete: "Completed",
  done: "Completed",
};

const priorityMap = {
  low: "Low",
  medium: "Medium",
  med: "Medium",
  high: "High",
  urgent: "High",
  critical: "High",
};

export const normalizeStatus = (value) => {
  if (typeof value !== "string") return "Pending";
  const key = value.trim().toLowerCase();
  return statusMap[key] || "Pending";
};

export const normalizePriority = (value) => {
  if (typeof value !== "string") return "Medium";
  const key = value.trim().toLowerCase();
  return priorityMap[key] || "Medium";
};

export const normalizeTask = (task) => ({
  ...task,
  status: normalizeStatus(task?.status),
  priority: normalizePriority(task?.priority),
});

