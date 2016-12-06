window.username = prompt('What is your name?', 'Anonymous');

window.socket.on('connect', function(data) {
  console.log(data);
});
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
