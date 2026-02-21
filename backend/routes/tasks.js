const express = require("express");
const mongoose = require("mongoose");

const auth = require("../middleware/auth");
const Task = require("../models/task");

const router = express.Router();

const ALLOWED_STATUS = ["Pending", "In Progress", "Completed"];
const ALLOWED_PRIORITY = ["Low", "Medium", "High"];

const normalizeStatus = (value) => {
  if (typeof value !== "string") return value;
  const key = value.trim().toLowerCase();

  const map = {
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

  return map[key] || value;
};

const normalizePriority = (value) => {
  if (typeof value !== "string") return value;
  const key = value.trim().toLowerCase();

  const map = {
    low: "Low",
    medium: "Medium",
    med: "Medium",
    high: "High",
    urgent: "High",
    critical: "High",
  };

  return map[key] || value;
};

const validateTaskPayload = (payload, isUpdate = false) => {
  const errors = [];

  if (!isUpdate || payload.title !== undefined) {
    const title = payload.title?.trim();
    if (!title) errors.push("Title is required");
    else if (title.length < 3)
      errors.push("Title must be at least 3 characters");
  }

  if (
    payload.status !== undefined &&
    !ALLOWED_STATUS.includes(payload.status)
  ) {
    errors.push("Invalid status value");
  }

  if (
    payload.priority !== undefined &&
    !ALLOWED_PRIORITY.includes(payload.priority)
  ) {
    errors.push("Invalid priority value");
  }

  return errors;
};

router.post("/", auth, async (req, res) => {
  try {
    const payload = {
      title: req.body.title,
      description: req.body.description,
      status: normalizeStatus(req.body.status),
      priority: normalizePriority(req.body.priority),
    };

    const errors = validateTaskPayload(payload);
    if (errors.length) {
      return res.status(400).json({ message: errors[0] });
    }

    const task = await Task.create({
      title: payload.title?.trim(),
      description: payload.description?.trim(),
      status: payload.status,
      priority: payload.priority,
      user: req.userId,
    });

    return res.status(201).json(task);
  } catch (_error) {
    return res.status(500).json({ message: "Failed to create task" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    return res.json(tasks);
  } catch (_error) {
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json(task);
  } catch (_error) {
    return res.status(500).json({ message: "Failed to fetch task" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    // Only allow known editable fields to avoid accidental writes.
    const updates = {};
    ["title", "description", "status", "priority"].forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    if (updates.status !== undefined) {
      updates.status = normalizeStatus(updates.status);
    }

    if (updates.priority !== undefined) {
      updates.priority = normalizePriority(updates.priority);
    }

    if (updates.title !== undefined && typeof updates.title === "string") {
      updates.title = updates.title.trim();
    }

    if (
      updates.description !== undefined &&
      typeof updates.description === "string"
    ) {
      updates.description = updates.description.trim();
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const errors = validateTaskPayload(updates, true);
    if (errors.length) {
      return res.status(400).json({ message: errors[0] });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json(task);
  } catch (_error) {
    return res.status(500).json({ message: "Failed to update task" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });
    if (!deleted) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.status(204).send();
  } catch (_error) {
    return res.status(500).json({ message: "Failed to delete task" });
  }
});

module.exports = router;
