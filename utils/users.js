const users = [];


// Присоединение пользователя к чату

function userJoin(id,username,room) {
  const user = { id, username, room };
  
  users.push(user);

  return user;
}


// Получение пользователя

function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

// Пользователь покидает комнату
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Получение пользователей комнаты
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
}