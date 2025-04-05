# Collaborative Study Room Application

A real-time collaborative study room application built with MERN stack (MongoDB, Express.js, React.js, Node.js) and Socket.IO.

## Features

- User Authentication (Register/Login)
- Real-time Study Rooms
- Task Management
- Note Taking
- Profile Management
- Responsive Design

## Tech Stack

- Frontend: React.js, Material-UI, Socket.IO Client
- Backend: Node.js, Express.js, Socket.IO
- Database: MongoDB
- Authentication: JWT

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Suraj08832/hackton.git
cd hackton
```

2. Install dependencies:
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

3. Create a .env file in the root directory:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the development server:
```bash
# Start backend server
npm run server

# Start frontend development server (in a new terminal)
cd client
npm start
```

## Deployment

### Backend Deployment (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables from your .env file

### Frontend Deployment (Render)

1. Create a new Static Site on Render
2. Connect your GitHub repository
3. Set the following:
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/build`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 