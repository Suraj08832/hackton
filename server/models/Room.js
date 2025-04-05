const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxParticipants: {
    type: Number,
    default: 10
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    default: ''
  },
  whiteboard: {
    type: String,
    default: ''
  },
  music: {
    currentTrack: {
      type: String,
      default: ''
    },
    isPlaying: {
      type: Boolean,
      default: false
    },
    timestamp: {
      type: Number,
      default: 0
    }
  },
  pomodoro: {
    isActive: {
      type: Boolean,
      default: false
    },
    currentPhase: {
      type: String,
      enum: ['work', 'break', 'longBreak'],
      default: 'work'
    },
    timeRemaining: {
      type: Number,
      default: 25 * 60 // 25 minutes in seconds
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Room', RoomSchema); 