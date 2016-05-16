/**
 * Created by karl on 15.05.2016.
 */
var playField = function() {
    map = [];
    playField.hello = function() {
        console.log("hello world")
    }
    playField.addPlayer = function(id, data, callback) {
        var player = {
            id: id,
            name: data.name,
            position: {
                x: 10,
                y: 100
            },
            size: 20,
            speed: 300
        };
        map.push(player);
        callback(player);
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
            size: 10
        };
        //console.log(entity)
        map.push(entity)
        setTimeout(playField.spawner, 1000);
    }

    playField.getRandomId = function() {
        return Math.random().toString(36).slice(2);
    }
    playField.getRandomCoordinate = function() {
        return Math.floor((Math.random() * 300) + 1);
    }

}

module.exports = playField;