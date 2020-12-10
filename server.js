const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require('./utils/users');


const botName='Bot_John'

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Раздача статики
app.use(express.static(path.join(__dirname, 'public')));

// Запускать когда клиент подключается 
io.on('connection', socket => {
  console.log('Новое подключение через веб-сокет');

  // Подключение к комнате 
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    
    socket.join(user.room);

    // Сообщение для подключившегося клиента
    socket.emit('message',formatMessage(botName,`${user.username} присоеденился`) );

    // Сообщение для всех клиентов, кроме того кто подключился
    // socket.broadcast.to(user.room).emit('message', formatMessage(botName,'Добро пожаловать в чат') );

    // Для всех пользователей
    // io.emit();

  })
  
  // Прослушивание сообщений 
  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);
    // Отправка полученного сообщения назад пользователям
    io.to(user.room).emit('message', formatMessage(user.username,msg) );
  })

  // Сообщение при отключении пользователя от чата
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }

    
  });

});

const PORT = process.env.PORT || 3000

server.listen(PORT, () => console.log(`Сервер запущен на ${PORT}`));