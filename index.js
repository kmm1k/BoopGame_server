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
        console.log('addPlayer')
        playField.addPlayer(socket.id, data, function(player) {
            socket.emit('getPlayer', {player: player})
        })
    })
    socket.on('updatePlayer', function(data) {
        console.log('updatePlayer')
        playField.updatePlayer(socket.id, data, function(map) {
            //console.log(map)
            socket.emit('map', {map: map})
        })
    })
    socket.on('removeEntity', function(data) {
        console.log('removeEntity')
        playField.removeEntity(socket.id, data, function (id) {
            socket.broadcast.emit('removeEntity', {id: id});
        })
    })
})