const express = require('express');
const path = require('path')
const webSocketServer = require('websocket').server;
const webSocketServerPort = 9000;
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/message')
const botName = 'node chatbot'
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')

const app = express()
const server = http.createServer(app);
const io = socketio(server);
server.listen(webSocketServerPort)
console.log('websocket on port 9000')

const wsServer = new webSocketServer({
    httpServer: server
})

const clients = {};

const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);  //generate unique user ID for usrs
  return s4() + s4() + '-' + s4();
};
wsServer.on('request', function (request) {
  var userID = getUniqueID();
  console.log((new Date()) + 'received new connection from origin' + request.origin);

  const connection = request.accept(null, request.origin);   //accept user connections to websocket server according to their userIDs and log it on console
  clients[userID] = connection;  //add users to clients list using the userID
  console.log('connected'  + userID + 'in' + Object.getOwnPropertyNames(clients)); 
})

//SET STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room);


        socket.emit('message', formatMessage(botName, 'welcome to node chat app'))
        //broadcast to others when user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

        //send users and chat info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    })
    console.log('new socket connection...')

    //listen for chat message
    socket.on('chatmessage', (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //disconnect user
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`))

            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    })
});


//const PORT = 9000 || process.env.PORT
//server.listen(PORT, () => console.log(`chat server running on port  ${PORT}`))