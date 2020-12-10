// Подключаем инпут чата
const chatForm = document.getElementById('chat-form');
// Прокрутка скролла вниз
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Получение имени пользователя и комнаты из URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix:true
});


const socket = io();

// Присоединение к комнате
// отправка пользователя и комнаты
socket.emit('joinRoom',{username,room})

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Получение сообщения от сервера
socket.on('message', message => {
  console.log(message);
  outputMessage(message);

  // Прокрутка скролла вниз
  chatMessages.scrollTop = chatMessages.scrollHeight;
})

// Перехватить submit 
// взять текст из Инпут и перенаправить его
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Перехват текста
  let msg = e.target.elements.msg.value;

  msg = msg.trim();
  
  if (!msg){
    return false;
  }

  // Отправка сообщения серверу
  socket.emit('chatMessage', msg);

  // Очистка инпута после отправления сообщения
  // + фокусировка
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
})


// outputMessage // передача сообщения в DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML=` <p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p> `
  document.querySelector('.chat-messages').appendChild(div);
}
// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach(user=>{
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
 }