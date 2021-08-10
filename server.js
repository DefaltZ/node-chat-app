const express  = require('express');
const path = require('path')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app);
const io = socketio(server);

//SET STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', socket => {
    console.log('new socket connection...')

    socket.emit('message', 'welcome to node chat app')
    //broadcast to others when user connects
    socket.broadcast.emit('message', 'A user has joined the chat');

    //disconnect user
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat')
    })
});
const PORT = 9000 || process.env.PORT
server.listen(PORT, () => console.log(`chat server running on port ${PORT}`))