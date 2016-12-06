window.username = prompt('What is your name?', 'Anonymous');

window.socket = io('http://104.236.47.47:8001');
window.socket.on('connect', function(){});
window.socket.on('chat', function(data){
  document.getElementById('chat-messages').innerHTML += '<div><strong>' + data.username  + '</strong>: ' + filterXSS(data.message) + '</div>';
});
window.socket.on('disconnect', function(){});

window.submitChat = function () {
  window.socket.emit('chat', {
    username: window.username,
    message: document.getElementById('chatbox').value
  });
  document.getElementById('chatbox').value = '';
};
