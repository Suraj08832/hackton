const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// Get all notes for a user
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id })
      .sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a new note
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      content,
      tags,
      isShared,
      sharedWith,
      color,
      room
    } = req.body;

    const note = new Note({
      title,
      content,
      user: req.user.id,
      tags,
      isShared,
      sharedWith,
      color,
      room
    });

    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a note
router.put('/:id', auth, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Make sure user owns the note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const {
      title,
      content,
      tags,
      isShared,
      sharedWith,
      color,
      isPinned
    } = req.body;

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isShared !== undefined) note.isShared = isShared;
    if (sharedWith) note.sharedWith = sharedWith;
    if (color) note.color = color;
    if (isPinned !== undefined) note.isPinned = isPinned;

    note.updatedAt = Date.now();
    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a note
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Make sure user owns the note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await note.remove();
    res.json({ message: 'Note removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get shared notes
router.get('/shared', auth, async (req, res) => {
  try {
    const notes = await Note.find({
      isShared: true,
      $or: [
        { user: req.user.id },
        { sharedWith: req.user.id }
      ]
    }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Search notes
router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query;
    const notes = await Note.find({
      user: req.user.id,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 