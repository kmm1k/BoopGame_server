/**
 * Created by karl on 15.05.2016.
 */
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var playField = require('./playField.js');
server.listen(8080, function () {
    console.log("server now running");
    playField();
    /*for (var i = 0; i < 20; i++) {
        playField.spawner()
    }*/
});


io.on('connection', function (socket) {
    console.log("player connected");
    socket.emit('socketID', {id: socket.id});
    socket.broadcast.emit('newPlayer', {id: socket.id});
    socket.on('disconnect', function () {
        console.log("player disconnected")
    });
    socket.on('addPlayer', function(data) {
        //see if there is an empty lobby
        var spawnAreaSize = 2000;
        playField.addPersonToLobby(socket.id, function(lobbyId, lobbyMade) {
            socket.emit('getLobbyId', {lobbyId: lobbyId});
            playField.makePlayArea(lobbyMade, lobbyId, spawnAreaSize, 20, 20000, function(){
                playField.getMap(lobbyId, socket.id, function(map) {
                    socket.emit('getMap', {map: map});
                    //add player to the lobby map
                    playField.addPlayer(lobbyMade, lobbyId, socket.id, spawnAreaSize, data, function(player, speed) {
                        socket.emit('getPlayer', {player: player});
                        socket.broadcast.emit('addEntity', {otherPlayer: player, lobbyId: lobbyId, speed: speed})
                    });
                })
            });
        });

    });
    socket.on('updatePlayer', function(data) {
        //console.log('updatePlayer');
        /*playField.updatePlayer(socket.id, data, function(player) {
            socket.broadcast.emit('player', {player: player})
        })*/
        playField.updatePlayer(socket.id, data, function () {
            playField.sendPlayerMap(data.lobbyId, socket.id, function(playerMap) {
                if (playerMap.length > 0){
                    socket.emit('playerMap', {playerMap: playerMap})
                }
            })
        })

    });
    socket.on('removeEntity', function(data) {
        console.log('removeEntity');
        playField.removeEntity(data, function (id) {
            //socket.broadcast.emit('removeEntity', {id: id, lobbyId: data.lobbyId});
        });
        /*playField.addEntity(data.lobbyId, function(entity) {
            socket.emit('addEntity', {otherPlayer: entity});
            socket.broadcast.emit('addEntity', {otherPlayer: entity, lobbyId: data.lobbyId})
        })*/
    })

});