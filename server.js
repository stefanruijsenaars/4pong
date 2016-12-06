var server = require('http').createServer();
var io = require('socket.io')(server);
var rooms = {};

io.on('connection', function(client){

  var getRoomList = function () {
    var roomList = [];
    for (var room in rooms) {
      if (rooms[room].left || rooms[room].right) {
        roomList.push(room);
      }
    }
    return roomList;

  };

  client.on('createRoom', function (data) {
    if (rooms[data.roomname] === undefined) {
      rooms[data.roomname] = {
        left: undefined,
        right: undefined
      };
    }
    rooms[data.roomname][data.side] = data.username;
    rooms[data.roomname].host = data.username;
    io.emit('roomList', {
      rooms: getRoomList()
    });
    client.emit('inviteToRoom', {
      roomname: data.roomname,
      side: data.side,
      isHost: true,
      opponents: []
    });
  });

  client.on('joinRoom', function (data) {
    var side;
    if (rooms[data.roomname] === undefined) {
      return;
    }
    if (rooms[data.roomname].left === undefined) {
      opponents = {right: rooms[data.roomname].right};
      side = left;
    } else if (rooms[data.roomname].right === undefined) {
      opponents = {left: rooms[data.roomname].left};
      side = right;
    } else {
      return;
    }
    client.emit('inviteToRoom', {
      roomname: data.roomname,
      side: side,
      isHost: false,
      opponents: opponents
    });
    rooms[data.roomname][side] = data.username;
  });


  client.on('getRoomList', function (data) {
    client.emit('roomList', {
      rooms: getRoomList()
    });
  });

  client.on('chat', function(data){
    io.emit('chat', data);
  });

  client.on('position', function(data) {
    client.broadcast.emit('position', data);
  })

  client.on('disconnect', function(){});

  client.on('connect', function(){});

});
server.listen(8001);
