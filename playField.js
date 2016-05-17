/**
 * Created by karl on 15.05.2016.
 */

var Entity = function(id, name, x, y, size, speed) {
    return {
        id: id,
        name: name,
        position: {
            x: x,
            y: y
        },
        size: size,
        speed: speed
    };
}
var HashMap = require('hashmap');
var playerMap;
var map;
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
    }
    playField.getMap = function(id, callback) {
        var localMap = map.clone();
        var mapArray = [];
        localMap.remove(id)
        //console.log(localPlayerMap)
        localMap.forEach(function(value, key) {
            mapArray.push(value);
        });
        callback(mapArray);
    }

    playField.spawner = function() {
        playField.addEntity(function(entity) {

        })
    }

    playField.addEntity = function(callback) {
        var id = playField.getRandomId();
        var entity = new Entity(id, "",
            playField.getRandomCoordinate(),
            playField.getRandomCoordinate(),
            10,
            0);
        map.set(id, entity)
        callback(entity);
    }


    playField.getRandomId = function() {
        return Math.random().toString(36).slice(2);
    }
    playField.getRandomCoordinate = function() {
        return Math.floor((Math.random() * 300) + 1);
    }

    playField.updatePlayer = function(id, data, callback) {
        var entity = playerMap.get(id);
        entity.position.x = data.x;
        entity.position.y = data.y;
        entity.speed = data.speed;
        entity.size = data.size;
        playerMap.set(id, entity);
        callback();
    }
    playField.removeEntity = function(data, callback) {
        map.remove(data.id);
        callback(data.id)
    }
    playField.itemPop = function(index, list) {
        if (index > -1) {
            list.splice(index, 1)
        }
        return list;
    }
    playField.sendPlayerMap = function(id, callback) {
        var localPlayerMap = playerMap.clone();
        var localPlayerArray = [];
        localPlayerMap.remove(id)
        //console.log(localPlayerMap)
        localPlayerMap.forEach(function(value, key) {
            localPlayerArray.push(value);
        });
        callback(localPlayerArray)
    }

}

module.exports = playField;