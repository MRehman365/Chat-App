const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT || 3000;

let users = {};

app.use(express.static(__dirname + '/Assets'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('join', (name) => {
    socket.username = name;
    users[socket.id] = name;
    io.emit('notification', `${name} joined the chat`);
    io.emit('user list', Object.values(users));
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      io.emit('notification', `${socket.username} left the chat`);
      delete users[socket.id];
      io.emit('user list', Object.values(users));
    }
    console.log('user disconnected');
  });

  socket.on('chat message', (msg) => {
    if (socket.username) {
      if (msg.to === 'all') {
        io.emit('chat message', { user: socket.username, message: msg.message });
      } else {
        const targetSocket = Object.keys(users).find(id => users[id] === msg.to);
        if (targetSocket) {
          io.to(targetSocket).emit('chat message', { user: socket.username, message: msg.message });
          socket.emit('chat message', { user: socket.username, message: msg.message });
        }
      }
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
