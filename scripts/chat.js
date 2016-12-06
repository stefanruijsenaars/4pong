window.username = prompt('What is your name?', 'Anonymous');

window.socket = io('http://localhost:8001');
window.socket.on('connect', function(){});
window.socket.on('chat', function(data){
  document.getElementById('chat-messages').innerHTML += '<div><strong>' + data.username  + '</strong>: ' + data.message + '</div>';
});
window.socket.on('disconnect', function(){});

window.submitChat = function () {
  window.socket.emit('chat', {
    username: window.username,
    message: document.getElementById('chatbox').value
  });
  document.getElementById('chatbox').value = '';
};