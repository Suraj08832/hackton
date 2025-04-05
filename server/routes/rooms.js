const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const auth = require('../middleware/auth');

// Create a new study room
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, isPrivate, password, maxParticipants } = req.body;

    const room = new Room({
      name,
      description,
      creator: req.user.id,
      participants: [req.user.id],
      isPrivate,
      password,
      maxParticipants
    });

    await room.save();
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all public rooms
router.get('/', auth, async (req, res) => {
  try {
    const rooms = await Room.find({ isPrivate: false })
      .populate('creator', 'username')
      .sort({ lastActive: -1 });
    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get room by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('creator', 'username')
      .populate('participants', 'username');
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Join a room
router.post('/:id/join', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.isPrivate && room.password !== req.body.password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    if (room.participants.length >= room.maxParticipants) {
      return res.status(400).json({ message: 'Room is full' });
    }

    if (!room.participants.includes(req.user.id)) {
      room.participants.push(req.user.id);
      await room.save();
    }

    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Leave a room
router.post('/:id/leave', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.participants = room.participants.filter(
      participant => participant.toString() !== req.user.id
    );

    await room.save();
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update room settings
router.put('/:id', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.creator.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, description, isPrivate, password, maxParticipants } = req.body;

    if (name) room.name = name;
    if (description) room.description = description;
    if (isPrivate !== undefined) room.isPrivate = isPrivate;
    if (password) room.password = password;
    if (maxParticipants) room.maxParticipants = maxParticipants;

    await room.save();
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update whiteboard
router.put('/:id/whiteboard', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.participants.includes(req.user.id)) {
      return res.status(401).json({ message: 'Not a participant' });
    }

    room.whiteboard = req.body.content;
    await room.save();
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update music state
router.put('/:id/music', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.participants.includes(req.user.id)) {
      return res.status(401).json({ message: 'Not a participant' });
    }

    const { currentTrack, isPlaying, timestamp } = req.body;
    room.music = { currentTrack, isPlaying, timestamp };
    await room.save();
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update pomodoro state
router.put('/:id/pomodoro', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.participants.includes(req.user.id)) {
      return res.status(401).json({ message: 'Not a participant' });
    }

    const { isActive, currentPhase, timeRemaining } = req.body;
    room.pomodoro = { isActive, currentPhase, timeRemaining };
    await room.save();
    res.json(room);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 