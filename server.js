const express  = require('express');
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/message')
const botName = 'node chatbot'

const app = express()
const server = http.createServer(app);
const io = socketio(server);

//SET STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', socket => {
    console.log('new socket connection...')

    socket.emit('message', formatMessage(botName, 'welcome to node chat app'))
    //broadcast to others when user connects
    socket.broadcast.emit('message', formatMessage(botName, 'A user has joined the chat'));

    //disconnect user
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, 'A user has left the chat'))
    })

    //listen for chat message
    socket.on('chatmessage', (msg) => {
        io.emit('message', formatMessage('USER', msg));
    });
});
const PORT = 9000 || process.env.PORT
server.listen(PORT, () => console.log(`chat server running on port ${PORT}`))