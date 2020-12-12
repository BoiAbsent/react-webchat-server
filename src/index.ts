const path = require('path')

const express = require('express');
const socket = require('socket.io');

const app = express();
const server = require('http').createServer(app);
const io = socket(server);

app.use(express.static(path.join(__dirname, '../../chat-client/dist')))

server.listen(3333, () => {
  console.log('server...', 3333);
});

interface Message {
  id: number,
  to_id: number,
  from_id: number,
  content: string,
  create_time: number,
}

const sockets:{[propName: string]: any} = {}
const mapId2Socket:{[propName: string]: string} = {}
const msgs:{[propName: string]: Message} = {}


io.on('connection', (socket: any) => {
  console.log('connection', socket.id)
  socket.on('init_link', (data:any) => {
    mapId2Socket[String(data.id)] = socket.id
    sockets[socket.id] = socket
  })
  socket.on('send_msg', (data: any) => {
    const { to_id, from_id, content, create_time } = data
    const msg_id = `${new Date().getTime()}${from_id}${to_id}`
    const msg = {
      ...data,
      id: Number(msg_id)
    }
    msgs[msg_id] = msg
    if (mapId2Socket[to_id] && sockets[mapId2Socket[to_id]]) {
      console.log('通知接收方')
      sockets[mapId2Socket[to_id]].emit('recv_msg', msg)
    }
    if (mapId2Socket[from_id] && sockets[mapId2Socket[from_id]]) {
      console.log('通知发送方')
      sockets[mapId2Socket[from_id]].emit('recv_msg', msg)
    }
  });
  // socket.emit('recv_msg', {
  //   data: '666'
  // });
});


