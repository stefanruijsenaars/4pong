var server = require('http').createServer();
var io = require('socket.io')(server);
io.on('connection', function(client){
  client.on('chat', function(data){
    io.emit('chat', data);
  });
  client.on('position', function(data) {
    client.broadcast.emit('position', data);
  })
  client.on('disconnect', function(){});
});
server.listen(8001);
