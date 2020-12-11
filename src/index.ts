import { Socket, SocketType } from "dgram";

const express = require('express');
const socket = require('socket.io');

const app = express();
const server = require('http').createServer(app);
const io = socket(server);

server.listen(3333, () => {
  console.log('server...', 3333);
});


io.on('connection', (socket: any) => {
  console.log('connection', socket.id)
  socket.on('send_msg', (data: any) => {
    console.log(data)
  });
  socket.send('recv_msg', {
    data: '666'
  });
});


