const express = require('express');
const app = express();

app.use('/', express.static(__dirname + '/public'));

server = app.listen(80, console.log('open'));

var clients = {}

const chat_history = new Array();

const io = require('socket.io')(server);

io.on('connection', client => {
  client.on("join", function(name){
    console.log("Joined: " + name);
    clients[client.id] = name;
    client.emit("update", "Você está conectado.");
    client.emit('history', chat_history);
    client.username = name;
    client.broadcast.emit("update", name + " has joined the server.");
  });

  client.on('change_username', username => {
    client.username = username;
    console.log(username) 
  });

  client.on('new_message', data => {
    console.log(data)
    chat_history.push({message: data.msg, username: client.username, date: data.data, hour: data.hora});
    client.broadcast.emit('user_msg', {message: data.msg, username: client.username, date: data.data, hour: data.hora})
    client.emit('user_msg', {message: data.msg, username: client.username, date: data.data, hour: data.hora})
  });

  client.on("disconnect", function(){
    console.log("Disconnect");
    io.emit("update", clients[client.id] + " has left the server.");
    delete clients[client.id];
  });
});