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
})
const PORT = 9000 || process.env.PORT
server.listen(PORT, () => console.log(`chat server running on port ${PORT}`))