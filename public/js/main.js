const chatform = document.getElementById('chat-form');
const chatmessages = document.querySelector('.chat-messages');

//get username and room from url

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

console.log(username, room)

const socket = io();

socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    //scroll down
    chatmessages.scrollTop = chatmessages.scrollHeight;

})

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