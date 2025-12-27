const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

const messages = [];

io.on('connection', (socket) => {
  socket.emit('history', messages);

  socket.on('post', (msg) => {
    const entry = {
      id: Date.now(),
      name: msg.name || 'Anon',
      text: msg.text || '',
      ts: new Date().toISOString()
    };
    messages.push(entry);
    io.emit('message', entry);
  });
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
