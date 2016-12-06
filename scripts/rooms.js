window.currentRoom = undefined;

window.socket.on('roomList', function (data) {
  var joinRoom = document.getElementById("join-room");
  for (i = 1; i < joinRoom.options.length; i++) {
    joinRoom.options[i] = null;
  }
  for (var i = 1; i < data.rooms.length; i++) {
    var option = document.createElement("option");
    option.text = filterXSS(data.rooms[i]);
    joinRoom.add(option);
  }
});

window.socket.on('inviteToRoom', function (data) {
  window.currentRoom = data.roomname;
  var state = window.game.state.getCurrentState();
  state.joinRoom(data.side, data.isHost);
});

window.createRoom = function () {
  var side = document.getElementById('create-room-player').value;
  if (side !== 'left' && site !== 'right') {
    alert('Please pick a side!');
    return;
  }
  window.socket.emit('createRoom', {
    roomname: document.getElementById('create-room').value,
    side: side,
    username: window.username
  });
};

window.joinRoom = function () {
  window.socket.emit('joinRoom', {
    roomname: document.getElementById('join-room').value,
    username: window.username
  });
}

window.updateRoomList = function () {
  window.socket.emit('getRoomList');
}