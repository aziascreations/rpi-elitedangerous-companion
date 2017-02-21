const fs = require("fs");
const low = require('lowdb');
const watch = require('node-watch');
//const readLastLines = require('read-last-lines');
const touch = require("touch")

console.log("Loading the config file...");
const db = low('config-logwatcher.json');
db.defaults(
	{
		clients: [
			{
				ip: "127.0.0.1",
				port: 42000
			}
		],
		logsFolder: "C:\\Users\\Herwin\\Saved Games\\Frontier Developments\\Elite Dangerous",
		filesHashes: {}
	}
).write();


var watchedFileName = db.get("logsFolder").value() + "\\" + process.argv[2];
console.log("Watching: %s", watchedFileName);
var lastFileSize = 0;
var lastLineNumber = 0;

lastFileSize = stats = fs.statSync(watchedFileName).size;
lastLineNumber = fs.readFileSync(watchedFileName).toString().split('\n').length;

function touchLogFile() {
	touch.sync(watchedFileName);
	
	var stats = fs.statSync(watchedFileName);
	
	//console.log("%s | %s -> %s", lastLineNumber, lastFileSize, stats.size);
	
	/*if(lastFileSize == 0) {
		lastFileSize = stats.size;
	} else /***/
	if(stats.size > lastFileSize) {
		lastFileSize = stats.size;
		
		var lines = fs.readFileSync(watchedFileName).toString().split('\n');
		
		for(var i=0; i<lines.length; i++) {
			if(i >= lastLineNumber-1) {
				sendLogData(lines[i]);
			}
		}
		
		lastLineNumber = lines.length;
	}
	
	setTimeout(touchLogFile, 2000);
}


// Not efficient enough
/*const md5File = require('md5-file')
var oldHash = null;
var watchedFileName = db.get("logsFolder").value() + "\\Journal.170219011605.01.log"
function checkLogChange() {
	md5File(watchedFileName, (err, hash) => {
		if(err)
			console.log(err);
		
		if(oldHash == null) {
			oldHash = hash;
			return;
		}
		
		if(!(hash===oldHash)) {
			console.log("%s - %s", oldHash, hash);
			readLastLines.read(watchedFileName, 2).then((lines) => sendLogData(lines));
			oldHash = hash;
		}
	});
	
	setTimeout(checkLogChange, 2000);
}
checkLogChange();/**/


//The file isn't updating until i open it for some reason.
/*console.log("Registering file watcher...");
if(!fs.existsSync(db.get("logsFolder").value())) {
	console.error("Logs folder doesn't exist. (%s)", db.get("logsFolder").value())
	process.exit(1);
}
var watcher = watch(db.get("logsFolder").value());
watcher.on('change', function(file) {
	//console.log("Change detected !");
	readLastLines.read(file, 2).then((lines) => sendLogData(lines));
});
watcher.on('error', function(err) {
	console.log(err);
});/**/


console.log("Connecting to app...");
var socket = require('socket.io-client')('http://localhost:42000');
socket.on('connect', function() {
	console.log("Connected !");
	
	var rawData = '{ "timestamp":"2017-02-19T01:00:38Z", "event":"Docked", "StationName":"Lazutkin Ring", "StationType":"Coriolis", "StarSystem":"Cai Shalang", "StationFaction":"Cai Shalang Free", "StationGovernment":"$government_Democracy;", "StationGovernment_Localised":"Democracy", "StationAllegiance":"Federation", "StationEconomy":"$economy_Industrial;", "StationEconomy_Localised":"Industrial" }';
	
	//socket.emit("logRaw", rawData);
});
socket.on('event', function(data) {
	console.log(data);
});
socket.on('disconnect', function() {
	console.log("Disconnected !");
});


function sendLogData(logRawLine) {
	if(logRawLine.length <= 1)
		return;
	
	console.log(logRawLine);
	socket.emit("logRaw", logRawLine);
	try {
		var data = JSON.parse(logRawLine);
		//socket.emit("logRaw", data);
	} catch(err) {
		console.error("Unable to parse last line !");
	}
}/**/

touchLogFile();
