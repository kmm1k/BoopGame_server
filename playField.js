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
var HashMap = require('hashmap');
var playerMap;
var map;
//set null point on what everything is based on
var nullPoint = 0;

var playField = function() {
    map = new HashMap();
    playerMap = new HashMap();
    playField.addPlayer = function(id, data, callback) {
        console.log(map);
        var entity = new Entity(id, data.name,
            playField.getRandomCoordinate()-100,
            playField.getRandomCoordinate()-300,
            20,
            300);
        map.set(id, entity);
        playerMap.set(id, entity);
        callback(entity);
    };
    playField.getMap = function(id, callback) {
        var localMap = map.clone();
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

    playField.addEntity = function(callback) {
        var id = playField.getRandomId();
        var entity = new Entity(id, "",
            playField.getRandomCoordinate(),
            playField.getRandomCoordinate(),
            10,
            0);
        map.set(id, entity);
        callback(entity);
    };


    playField.getRandomId = function() {
        return Math.random().toString(36).slice(2);
    };
    playField.getRandomCoordinate = function() {
        return Math.floor((Math.random() * 300) + 1);
    };

    playField.updatePlayer = function(id, data, callback) {
        var entity = playerMap.get(id);
        entity.position.x = data.x;
        entity.position.y = data.y;
        entity.speed = data.speed;
        entity.size = data.size;
        playerMap.set(id, entity);
        callback();
    };
    playField.removeEntity = function(data, callback) {
        map.remove(data.id);
        callback(data.id)
    };
    playField.itemPop = function(index, list) {
        if (index > -1) {
            list.splice(index, 1)
        }
        return list;
    };
    playField.sendPlayerMap = function(id, callback) {
        var localPlayerMap = playerMap.clone();
        var localPlayerArray = [];
        localPlayerMap.remove(id);
        //console.log(localPlayerMap)
        localPlayerMap.forEach(function(value, key) {
            localPlayerArray.push(value);
        });
        callback(localPlayerArray)
    };

    playField.makeSpawnArea = function(wallW, wallH, size, callback) {
        //draw out walls
        var wall1 = new WallEntity(playField.getRandomId(), "",
            nullPoint, nullPoint, size, 0, wallW, wallH, 0);
        var wall2 = new WallEntity(playField.getRandomId(), "",
            nullPoint, nullPoint+wallW-wallH, size, 0, wallW, wallH, 0);
        var wall3 = new WallEntity(playField.getRandomId(), "",
            nullPoint+wallH, nullPoint, size, 0, wallW, wallH, 90);
        var wall4 = new WallEntity(playField.getRandomId(), "",
            nullPoint+wallW, nullPoint, size, 0, wallW, wallH, 90);
        //draw out points
        //add walls and points to the map
        map.set(wall1.id, wall1);
        map.set(wall2.id, wall2);
        map.set(wall3.id, wall3);
        map.set(wall4.id, wall4);
        callback();
    };

    playField.makePlayArea = function(wallW, wallH, size, callback) {
        playField.makeSpawnArea(wallW, wallH, 20000, function() {

        })
    }

};

module.exports = playField;