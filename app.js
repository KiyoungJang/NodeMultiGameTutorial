/////////////////// Web Server ///////////////////////
var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log("HTTP Server started.");

/////////////////// Socket Server ///////////////////////
var SOCKET_LIST = {};

var PLAYER_LIST = {};

var Player = function(id) {
    var self = {
        "x": 250,
        "y": 250,
        "id": id,
        "number": "" + Math.floor(10 * Math.random()), 
    }
    return self;
}

console.log("Starting socket Server.");
var io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket) {
    console.log('socket connection');
    socket.id = Math.random();
    socket.x = 0;
    socket.y = 0;
    socket.number = "" + Math.floor(10 * Math.random());
    SOCKET_LIST[socket.id] = socket;

    socket.on('happy', function(data) {
        console.log('happy' + ' reason ' + data.reason);
    });

    socket.emit('serverMsg', {
        "msg": 'Welcome',
    });

    socket.on('disconnect', function() {
        console.log("Socket Disconnected.");
        delete SOCKET_LIST[socket.id];
    });
});
console.log("Socket Server Started.");

setInterval(function () {
    var pack = [];
    for (let i in SOCKET_LIST) {
        let socket = SOCKET_LIST[i];
        socket.x++;
        socket.y++;
        pack.push({
            "x": socket.x,
            "y": socket.y,
            "number": socket.number,
        });
    }

    for (let i in SOCKET_LIST) {
        let socket = SOCKET_LIST[i];
        socket.emit('newPosition', pack);
    }
});