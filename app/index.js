import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const events = (socket) => {

  socket.conn.once('upgrade', () => {
    // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
    console.log('upgraded transport', socket.conn.transport.name); // prints "websocket"
  });

  socket.emit('get-messages', [
    {
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea, quibusdam!',
      id: 1,
      sender: false,
      send_time: new Date().getTime(),
    },
    {
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea, quibusdam!',
      sender: true,
      id: 2,
      send_time: new Date().getTime(),
    },
  ]);

  socket.on('message:send', (e) => {
    console.log(e);
    socket.emit('message:get', {
      text: e.text + 1,
      id: 12,
      sender: false,
      send_time: new Date().getTime(),
    });
  });
};

io.on('connection', events);


httpServer.listen(3333);
