console.log("Connecting to app...");
var socket = require('socket.io-client')('http://localhost:42000');
socket.on('connect', function() {
	console.log("Connected !");
	
	var rawData = '{"timestamp":"2017-02-19T15:01:04Z","event":"LoadGame","Commander":"Azias","Ship":"Orca","ShipID":24,"GameMode":"Open","Credits":31902430,"Loan":0}';
	
	try {
		JSON.parse(rawData);
		socket.emit("logRaw", rawData);
	} catch(err) {
		console.log(err);
	}
});
socket.on('event', function(data) {
	console.log(data);
});
socket.on('disconnect', function() {
	console.log("Disconnected !");
});
