const express = require('express');
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/message')
const botName = 'node chatbot'
const {userJoin, getCurrentUser} = require('./utils/users')

const app = express()
const server = http.createServer(app);
const io = socketio(server);

//SET STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room);


        socket.emit('message', formatMessage(botName, 'welcome to node chat app'))
        //broadcast to others when user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));
    })
    console.log('new socket connection...')

    //listen for chat message
    socket.on('chatmessage', (msg) => {
        io.emit('message', formatMessage('USER', msg));
    });

    //disconnect user
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName, ` has left the chat`))
    })
});
const PORT = 9000 || process.env.PORT
server.listen(PORT, () => console.log(`chat server running on port ${PORT}`))