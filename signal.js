
const server = require("http").createServer()
//const io = require("socket.io")(server)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});
const socketByPeerId = new Map()
const socketsByRoom = new Map()
io.on("connection", function(socket) {
  socket.on("signal", message => {
    socketByPeerId.get(message.to).emit("signal", message)
  })

  socket.on("join", message => {
    if (!socketsByRoom.has(message.room)) {
      console.log("START NEW ROOM: " + message.room)
      socketsByRoom.set(message.room, [])
    }
    socketsByRoom.get(message.room).push({
      socket,
      peerId: message.peerId
    })
    socketByPeerId.set(message.peerId, socket)
    const roomPeerIds = socketsByRoom.get(message.room).map(row => row.peerId)
    socketsByRoom.get(message.room).forEach(row => {
      row.socket.emit("joined", roomPeerIds)
    })
  })
})

return new Promise(res => {
  server.listen(10103, () => {
    res("ws://117.192.46.245:" + 10103)
  })
})
