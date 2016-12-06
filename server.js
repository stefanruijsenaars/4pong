var server = require('http').createServer();
var io = require('socket.io')(server);
var rooms = [];

io.on('connection', function(client){
  client.on('createRoom', function (data) {
    rooms.push(data.roomname)
    io.emit('roomList', function () {
      return {rooms: rooms};
    });
  });

  client.on('chat', function(data){
    io.emit('chat', data);
  });

  client.on('position', function(data) {
    client.broadcast.emit('position', data);
  })

  client.on('disconnect', function(){});

  client.on('connect', function(){
    client.emit('roomList', function () {
      return {rooms: rooms};
    })
  });

});
server.listen(8001);
