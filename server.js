var server = require('http').createServer();
var io = require('socket.io')(server);
io.on('connection', function(client){
  client.on('chat', function(data){
    client.emit('chat', data);
  });
  client.on('disconnect', function(){});
});
server.listen(8001);
