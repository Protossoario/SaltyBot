var http = require('http');
var dbconnect = require('./SaltyDBConnect.js');

var headers = {
    'Connection' : 'keep-alive'
};

var options = {
    hostname: 'www.saltybet.com',
    port: 80,
    path: '/state.json',
    method: 'GET',
    headers : headers
};

var callback = function(res) {
    res.on('data', function(chunk) {
        var state = JSON.parse(chunk);
	console.log('\n==================================================\n\n');
        console.log('Current match state:');
        console.log(state.p1name + ' VS ' + state.p2name);
        console.log('Total pot for ' + state.p1name + ': $' + state.p1total);
        console.log('Total pot for ' + state.p2name + ': $' + state.p2total);
        if (state.status == 'open') {
            console.log('Bets are currently open!');
        }
        else if (state.status == 'locked') {
            console.log('Bets are locked. Match in progress.');
        }
        else if (state.status == '1') {
            console.log('The winner is ' + state.p1name + '!');
        }
        else if (state.status == '2') {
            console.log('The winner is ' + state.p2name + '!');
        }
        if (state.alert != '') {
            console.log(state.alert);
        }
	if (!isNaN(state.status)) {
	    console.log('\n================MESSAGING SALTYDB=================\n\n');
            var p1pot = parseInt(state.p1total.replace(/,/g, ""));
            var p2pot = parseInt(state.p2total.replace(/,/g, ""));
	    var status = parseInt(state.status);
	    dbconnect.addFighter(state.p1name);
	    dbconnect.addFighter(state.p2name);
	    dbconnect.addFight(state.p1name, state.p2name, p1pot, p2pot, status);
	}
	console.log('\n==================================================\n\n');
    });
};

module.exports = {
    sendRequest : function() {
        var req = http.request(options, callback);
        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });
        req.end();
    }
};
