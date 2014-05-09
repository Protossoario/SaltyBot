var io = require('socket.io-client');
var socket = io.connect('http://www-cdn-twitch.saltybet.com:8000');
var test = require('./SaltyTest.js');
socket.on('message', function(data) {
    try {
        console.log('New message received from server');
        test.sendRequest();
    }
    catch (e) {
        console.log('Error en el mensaje del socket');
        console.log(e);
        return;
    }
});
