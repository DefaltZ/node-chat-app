const chatform = document.getElementById('chat-form');
const chatmessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io();

//join chatroom
socket.emit('joinRoom', {username, room})

socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scroll down
    chatmessages.scrollTop = chatmessages.scrollHeight;

})

//get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

//message submit
chatform.addEventListener('submit', (e) => {
    e.preventDefault();
    
    //get text message
    const msg = e.target.elements.msg.value;
    
    //emit message to server
    socket.emit('chatmessage', msg);

    //clear chat box
    e.target.elements.msg.value = '',
    e.target.elements.msg.focus();
})

//show message to DO<
function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div)
}

//add room name to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

//add users to DOM
function outputUsers(users){
    userList.innerHTML = ` 
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}