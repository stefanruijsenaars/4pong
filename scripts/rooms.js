
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

window.createRoom = function () {
  window.socket.emit('createRoom', {
    roomname: document.getElementById('create-room').value
  });
};

window.updateRoomList = function () {
  window.socket.emit('getRoomList');
}