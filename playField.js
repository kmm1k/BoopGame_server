/**
 * Created by karl on 15.05.2016.
 */
var playField = function() {
    var map = [];
    playField.hello = function() {
        console.log("hello world")
    }
    playField.addPlayer = function(id, data, callback) {
        console.log(map);
        var entity = {
            id: id,
            name: data.name,
            position: {
                x: 10,
                y: 100
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
            setTimeout(playField.spawner, 2000);
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
                break;
            }
        }
        callback(map);
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

}

module.exports = playField;