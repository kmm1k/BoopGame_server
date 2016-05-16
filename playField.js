/**
 * Created by karl on 15.05.2016.
 */
var playField = function() {
    var map = [];
    playField.addPlayer = function(id, data, callback) {
        console.log(map);
        var entity = {
            id: id,
            name: data.name,
            position: {
                x: -100,
                y: -100
            },
            size: 20,
            speed: 300
        };
        map.push(entity);
        console.log(map)
        callback(entity);
    }
    playField.getMap = function() {
        return map
    }

    playField.spawner = function() {
        if (map.length > 20)
            return;
        var entity = {
            id: playField.getRandomId(),
            name: "",
            position: {
                x: playField.getRandomCoordinate(),
                y: playField.getRandomCoordinate()
            },
            size: 10,
            speed: 0
        };
        //console.log(entity)
        map.push(entity)
    }

    playField.addEntity = function(callback) {
        var entity = {
            id: playField.getRandomId(),
            name: "",
            position: {
                x: playField.getRandomCoordinate(),
                y: playField.getRandomCoordinate()
            },
            size: 10,
            speed: 0
        };
        map.push(entity);
        callback(entity);
    }

    playField.getRandomId = function() {
        return Math.random().toString(36).slice(2);
    }
    playField.getRandomCoordinate = function() {
        return Math.floor((Math.random() * 300) + 1);
    }

    playField.updatePlayer = function(id, data, callback) {
        for (var i = 0; i<map.length; i++) {
            if (id == map[i].id) {
                map[i].position.x = data.x;
                map[i].position.y = data.y;
                map[i].speed = data.speed;
                map[i].size = data.size;
                callback(map[i]);
                return;
            }
        }
    }
    playField.removeEntity = function(id, data, callback) {
        for (var i = 0; i<map.length; i++) {
            if (data.id == map[i].id) {
                map = playField.itemPop(i, map);
                callback(data.id)
                return;
            }
        }
    }
    playField.itemPop = function(index, list) {
        if (index > -1) {
            list.splice(index, 1)
        }
        return list;
    }
    playField.newSpawner = function(callback) {
        var entity = {
            id: playField.getRandomId(),
            position: {
                x: playField.getRandomCoordinate(),
                y: playField.getRandomCoordinate()
            },
            size: 10,
            speed: 0
        };
        //console.log(entity)
        map.push(entity)
        callback(entity);
    }

}

module.exports = playField;