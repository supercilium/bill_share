import express, { urlencoded, json } from "express";
import http from 'http';
import { Server } from "socket.io";

const PORT = process.env.PORT || 3001;

const app = express();
const server = http.createServer(app);
app.use(urlencoded({ extended: false }));
app.use(json());
app.use(express.static(__dirname + "/public"));

const masters = []
const parties = new Map();
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

// Static files
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
});
app.get('/party/:id', (req, res) => {
  res.sendFile(__dirname + '/public/party.html')
});

app.put('/party/:username', (req, res) => {
  const partyId = getUniqueID();
  parties.set(partyId, { master: req.params.username })
  console.log(parties);
  res.send(partyId);
})

server.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

// Socket setup
const io = new Server(server, { /* options */ });

io.on("connection", function (socket) {
  console.log("Made socket connection");

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', { message: msg });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
