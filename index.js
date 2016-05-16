/**
 * Created by karl on 15.05.2016.
 */
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var playField = require('./playField.js');
server.listen(8080, function () {
    console.log("server now running")
    playField();
    playField.hello()
    playField.spawner()
});

io.on('connection', function (socket) {
    console.log("player connected");
    socket.emit('socketID', {id: socket.id});
    socket.broadcast.emit('newPlayer', {id: socket.id});
    socket.on('disconnect', function () {
        console.log("player disconnected")
    })
    socket.on('addPlayer', function(data) {
        console.log(data)
        playField.addPlayer(socket.id, data, function(player) {
            socket.emit('getPlayer', {player: player})
        })
    })
    socket.on('updatePlayer', function(data) {
        //TODO: vb tuleks playeritel mingid
        // id d objektide nimeks panna hoopis läheks lihtsamaks
    })
})