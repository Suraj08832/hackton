const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Get all tasks for a user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new task
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      priority,
      dueDate,
      estimatedTime,
      tags,
      room
    } = req.body;

    const task = new Task({
      title,
      description,
      user: req.user.id,
      priority,
      dueDate,
      estimatedTime,
      tags,
      room
    });

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a task
router.put('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const {
      title,
      description,
      status,
      priority,
      dueDate,
      estimatedTime,
      actualTime,
      tags
    } = req.body;

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate) task.dueDate = dueDate;
    if (estimatedTime) task.estimatedTime = estimatedTime;
    if (actualTime) task.actualTime = actualTime;
    if (tags) task.tags = tags;

    if (status === 'completed' && !task.completedAt) {
      task.completedAt = Date.now();
    }

    task.updatedAt = Date.now();
    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Make sure user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await task.remove();
    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get task statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    
    const stats = {
      total: tasks.length,
      completed: tasks.filter(task => task.status === 'completed').length,
      inProgress: tasks.filter(task => task.status === 'in-progress').length,
      pending: tasks.filter(task => task.status === 'pending').length,
      highPriority: tasks.filter(task => task.priority === 'high').length,
      totalEstimatedTime: tasks.reduce((acc, task) => acc + task.estimatedTime, 0),
      totalActualTime: tasks.reduce((acc, task) => acc + task.actualTime, 0)
    };

    res.json(stats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 