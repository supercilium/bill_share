import express, { urlencoded, json } from "express";
import http from 'http';
import cors from 'cors';
import { Server } from "socket.io";

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(urlencoded({ extended: false }));
app.use(json());

const masters = []
const parties = new Map();
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

app.get('/party', (req, res) => {
  res.send(Array.from(parties).map(([id, options]) => ({ id, ...options })))
});

app.get('/party/:partyId', (req, res) => {
  const partyId = req.params.partyId;
  const party = parties.get(partyId);
  if (!party) {
    res.sendStatus(400)
  }
  res.send({ id: partyId, ...party });
})

app.post('/party', (req, res) => {
  const partyId = getUniqueID();
  parties.set(partyId, { master: req.body.userName, userList: [] })
  console.log(parties.entries());
  res.send({ partyId });
})

app.put('/party/:partyId', (req, res) => {
  const partyId = req.params.partyId;
  const party = parties.get(partyId);
  if (!party) {
    res.sendStatus(400)
  }
  parties.set(partyId, { ...party, users: [...(party.users || []), req.body.userName] })
  console.log(parties);
  res.send({ id: partyId, ...parties.get(partyId) });
})

server.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Socket setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  }
});

io.on("connection", function (socket) {
  console.log("Made socket connection");

  socket.on('add user', (msg) => {
    console.log('message: ' + msg);
    io.emit('add user', { message: msg });
  });

  socket.on('user join', ({ userId, partyId }) => {
    console.log('user %s joined party %s', userId, partyId);
    const party = parties.get(partyId);
    if (!party) {
      io.emit('user join', { error: 'No such party' })
      return;
    }
    io.emit('user join', { userList: party.userList });
  });

  socket.on('remove user', ({ userId, partyId }) => {
    console.log('user %s left party %s', userId, partyId);
    const party = parties.get(partyId);
    if (!party) {
      io.emit('remove user', { error: 'No such party' })
      return;
    }
    io.emit('remove user', { userList: party.userList });
  });

  socket.on('add item', ({ userId, partyId, itemId }) => {
    console.log('user %s add %itemId to party %s', userId, itemId, partyId);
    const party = parties.get(partyId);
    if (!party) {
      io.emit('add item', { error: 'No such party' })
      return;
    }
    io.emit('add item', { userList: party.userList });
  });

  socket.on('update item', ({ userId, partyId, itemId }) => {
    console.log('user %s updated %itemId in party %s', userId, itemId, partyId);
    const party = parties.get(partyId);
    if (!party) {
      io.emit('update item', { error: 'No such party' })
      return;
    }
    io.emit('update item', { userList: party.userList });
  });

  socket.on('remove item', ({ userId, partyId, itemId }) => {
    console.log('user %s removed %itemId from party %s', userId, itemId, partyId);
    const party = parties.get(partyId);
    if (!party) {
      io.emit('remove item', { error: 'No such party' })
      return;
    }
    io.emit('remove item', { userList: party.userList });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
