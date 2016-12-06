
window.socket.on('roomList', function (data) {
  var joinRoom = document.getElementById("join-room");
  for (i = 1; i < joinRoom.options.length; i++) {
    select.options[i] = null;
  }
  for (var i = 1; i < data.rooms.length; i++) {
    var option = document.createElement("option");
    option.text = data.rooms[i];
    joinRoom.add(option);
  }
});

window.createRoom = function () {
  window.socket.emit('createRoom', {
    roomname: document.getElementById('create-room').value
  });
};