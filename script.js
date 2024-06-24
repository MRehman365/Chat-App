const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

const name = prompt('Enter your name:');
socket.emit('join', name);

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  }
});

socket.on('chat message', function (msg) {
  const item = document.createElement('li');
  item.textContent = `${msg.user}: ${msg.message}`;
  item.classList.add(msg.user === name ? 'right' : 'left');
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('notification', function (msg) {
  const item = document.createElement('li');
  item.textContent = msg;
  item.classList.add('notification');
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
