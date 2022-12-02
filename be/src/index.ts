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
    return;
  }
  res.send({ id: partyId, ...party });
})

app.post('/party', (req, res) => {
  const partyId = getUniqueID();
  const masterId = getUniqueID();
  parties.set(partyId, { master: { name: req.body.userName, id: masterId }, name: req.body.partyName, users: [] })
  console.log(parties.entries());
  res.send({ partyId });
})

app.put('/party/:partyId', (req, res) => {
  const partyId = req.params.partyId;
  const party = parties.get(partyId);
  if (!party) {
    res.sendStatus(400)
  }
  parties.set(partyId, { ...party, users: [...(party.users || []), { name: req.body.userName, id: getUniqueID() }] })
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
    const { userName, partyId } = JSON.parse(msg)
    console.log(parties);

    console.log('user %s joined party %s', userName, partyId);
    const party = parties.get(partyId);
    if (!party) {
      io.emit('add user', { error: 'No such party' })
      return;
    }
    parties.set(partyId, { ...party, users: [...(party.users || []), { name: userName, id: getUniqueID() }] })
    io.emit('add user', { id: partyId, ...parties.get(partyId) });
  });

  socket.on('remove user', (msg) => {
    const { userId, partyId } = JSON.parse(msg)
    console.log('user %s left party %s', userId, partyId);
    const party = parties.get(partyId);
    if (!party) {
      io.emit('remove user', { error: 'No such party' })
      return;
    }
    if (!party.users) {
      io.emit('remove user', { error: 'No such user' })
      return;
    }
    parties.set(partyId, { ...party, users: [...(party.users).filter(({ id }: { id: string }) => id !== userId)] })
    io.emit('remove user', { id: partyId, ...parties.get(partyId) });
  });

  socket.on('add item', (msg) => {
    const { userId, partyId, itemId } = JSON.parse(msg)
    console.log('user %s add %s to party %s', userId, itemId, partyId);
    const party = parties.get(partyId);
    if (!party) {
      io.emit('add item', { error: 'No such party' })
      return;
    }
    io.emit('add item', { users: party.users });
  });

  socket.on('update item', (msg) => {
    const { userId, partyId, itemId } = JSON.parse(msg)
    console.log('user %s updated %s in party %s', userId, itemId, partyId);
    const party = parties.get(partyId);
    if (!party) {
      io.emit('update item', { error: 'No such party' })
      return;
    }
    io.emit('update item', { users: party.users });
  });

  socket.on('remove item', (msg) => {
    const { userId, partyId, itemId } = JSON.parse(msg)
    console.log('user %s removed %s from party %s', userId, itemId, partyId);
    const party = parties.get(partyId);
    if (!party) {
      io.emit('remove item', { error: 'No such party' })
      return;
    }
    io.emit('remove item', { users: party.users });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
