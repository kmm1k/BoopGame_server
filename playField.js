/**
 * Created by karl on 15.05.2016.
 */

var Entity = function(id, name, x, y, size, speed) {
    return {
        type: "circle",
        id: id,
        name: name,
        position: {
            x: x,
            y: y
        },
        size: size,
        speed: speed
    };
};
//did not find a good way to extend objects...
var WallEntity = function(id, name, x, y, size, speed, w, h, angle) {
    return {
        type: "wall",
        id: id,
        name: name,
        position: {
            x: x,
            y: y
        },
        size: size,
        speed: speed,
        width: w,
        height: h,
        angle: angle
    };
};

var Lobby = function(id) {
    return {
        id: id,
        players: [],
        ended: false,
        map: null,
        playerMap: null
    };
}

var Player = function(id) {
    return {
        id: id
    };
}
var HashMap = require('hashmap');
var playerMap;
var map;
var lobbys;
//set null point on what everything is based on
var nullPoint = 0;

var playField = function() {
    map = new HashMap();
    playerMap = new HashMap();
    lobbys = new HashMap();
    playField.addPlayer = function(lobbyMade, lobbyId, id, spawnAreaSize, data, callback) {
        var speed = 0
        if (lobbyMade){
            speed = 200;
        }
        var lobby = lobbys.get(lobbyId);
        var x = spawnAreaSize/2;
        var y = 0;
        if (lobby.players.length == 1) {
            y = (spawnAreaSize/10)*9;
        }else {
            y = (spawnAreaSize/10)*1;
        }
        var entity = new Entity(id, data.name,
            x,
            y,
            20,
            speed);
        lobby.map.set(id, entity);
        lobby.playerMap.set(id, entity);
        callback(entity, speed);
    };
    playField.getMap = function(lobbyId, id, callback) {
        var lobby = lobbys.get(lobbyId)
        var localMap = lobby.map.clone();
        var mapArray = [];
        localMap.remove(id);
        //console.log(localPlayerMap)
        localMap.forEach(function(value, key) {
            mapArray.push(value);
        });
        callback(mapArray);
    };

    playField.spawner = function() {
        playField.addEntity(function(entity) {

        })
    };

    playField.addEntity = function(lobbyId, callback) {
        var lobby = lobbys.get(lobbyId);
        var id = playField.getRandomId();
        var entity = new Entity(id, "",
            playField.getRandomCoordinate(),
            playField.getRandomCoordinate(),
            10,
            0);
        lobby.map.set(id, entity);
        callback(entity);
    };


    playField.getRandomId = function() {
        return Math.random().toString(36).slice(2);
    };
    playField.getRandomCoordinate = function() {
        return Math.floor((Math.random() * 300) + 1);
    };
    playField.getRandomCoordinateDef = function(coord, wallW) {
        var min = coord+20;
        var max = coord+wallW-20;
        return Math.floor(Math.random() * (max - min)) + min;
    };

    playField.updatePlayer = function(id, data, callback) {
        var lobby = lobbys.get(data.lobbyId);
        var entity = lobby.playerMap.get(id);
        entity.position.x = data.x;
        entity.position.y = data.y;
        entity.speed = data.speed;
        entity.size = data.size;
        lobby.playerMap.set(id, entity);
        callback();
    };
    playField.removeEntity = function(data, callback) {
        var lobby = lobbys.get(data.lobbyId);
        lobby.map.remove(data.id);
        callback(data.id)
    };
    playField.itemPop = function(index, list) {
        if (index > -1) {
            list.splice(index, 1)
        }
        return list;
    };
    playField.sendPlayerMap = function(lobbyId, id, callback) {
        var lobby = lobbys.get(lobbyId);
        var localPlayerMap = lobby.playerMap.clone();
        var localPlayerArray = [];
        localPlayerMap.remove(id);
        //console.log(localPlayerMap)
        localPlayerMap.forEach(function(value, key) {
            localPlayerArray.push(value);
        });
        callback(localPlayerArray)
    };

    playField.spawnEntity = function(lobbyId, wallW, x, y) {
        var lobby = lobbys.get(lobbyId);
        var id = playField.getRandomId();
        var entity = new Entity(id, "",
            playField.getRandomCoordinateDef(x, wallW),
            playField.getRandomCoordinateDef(y, wallW),
            10,
            0);
        lobby.map.set(id, entity);
    }

    playField.makeSpawnArea = function(lobbyId, wallW, wallH, size, x, y, callback) {
        var lobby = lobbys.get(lobbyId);
        for (var i = 0; i < 20; i++) {
         playField.spawnEntity(lobbyId, wallW, x, y);
        }
        //draw out walls
        var wall1 = new WallEntity(playField.getRandomId(), "",
            x, y, size, 0, wallW, wallH, 0);
        var wall2 = new WallEntity(playField.getRandomId(), "",
            x, y+wallW-wallH, size, 0, wallW, wallH, 0);
        var wall3 = new WallEntity(playField.getRandomId(), "",
            x+wallH, y, size, 0, wallW, wallH, 90);
        var wall4 = new WallEntity(playField.getRandomId(), "",
            x+wallW, y, size, 0, wallW, wallH, 90);
        //draw out points
        //add walls and points to the map
        lobby.map.set(wall1.id, wall1);
        lobby.map.set(wall2.id, wall2);
        lobby.map.set(wall3.id, wall3);
        lobby.map.set(wall4.id, wall4);
        callback();
    };

    playField.makePlayArea = function(lobbyMade, lobbyId, wallW, wallH, size, callback) {
        if(!lobbyMade){
            playField.makeSpawnArea(lobbyId, wallW, wallH, size, 0, 0, function() {
                playField.makeSpawnArea(lobbyId, wallW/5, wallH, 50, (wallW/2)-((wallW/5)/2), wallH, function() {
                    playField.makeSpawnArea(lobbyId, wallW/5, wallH, 50, (wallW/2)-((wallW/5)/2), wallW-(wallW/5)-wallH, function() {
                        callback();
                    })
                })
            })
        }else{
            callback();
        }


    }

    playField.makeLobby = function(callback) {
        var id = playField.getRandomId()
        var lobby = new Lobby(id);
        lobby.playerMap = new HashMap();
        lobby.map = new HashMap();
        lobbys.set(id, lobby);
        callback(lobby);
    }

    playField.getLobby = function(callback) {
        var noLobby = 0;
        if (lobbys.count() < 1) {
            console.log('no lobbies making one');
            playField.makeLobby(function(lobby) {
                callback(lobby, false)
            })
        }else {
            var lobbyCounter = 0;
            lobbys.forEach(function(value, key) {
                    lobbyCounter++;
                    if (value.players.length < 2) {
                        console.log('found a lobby joining');
                        callback(value, true);
                        return;
                    }
                    console.log(lobbys.count());
                    if (lobbys.count() == lobbyCounter) {
                        //ssssssssssssssssssssss
                        playField.makeLobby(function(lobby) {
                            console.log('making a new lobby 2nd');
                            callback(lobby, false)
                        })
                    }
                }

            );
        }

    }

    playField.addPersonToLobby = function(id, callback) {
        playField.getLobby(function(lobby, lobbyMade) {
            lobby.players.push(new Player(id));
            callback(lobby.id, lobbyMade)
        })
    }


};

module.exports = playField;