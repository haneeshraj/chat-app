import path from 'path';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import 'colors';

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const __dirname = path.resolve();

const connectedUsers = new Set();

io.on('connection', (socket) => {
  console.log('User Connected: ', socket.id);
  connectedUsers.add(socket.id);
  io.emit('connectedUsers', connectedUsers.size);

  socket.on('disconnect', () => {
    connectedUsers.delete(socket.id);
    console.log('User Disconnected: ', socket.id);
    io.emit('connectedUsers', connectedUsers.size);
  });

  socket.on('chatMessage', (message) => {
    console.log(`${message.user} : ${message.text}`);
    socket.broadcast.emit('message', message);
  });

  socket.on('userJoined', (name) => {
    io.emit('userJoined', { name, type: 'message--joined' });
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
  );
} else {
  app.get('/api', (req, res) => {
    res.send('Api is running.');
  });
}

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT.yellow.bold}`.green);
});
