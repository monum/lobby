var async = require('async');
var r = require('rethinkdb');

var Calendar = require('./tasks/calendar');
var Open311 = require('./tasks/open311');

var config = require('./config-default');

console.log("Establishing DB Connection...");
r.connect({host: config.r.host, port: config.r.port}, function (err, rConn) {
	if (err) return console.error(err);
	console.log("Done.");
	
	console.log("Creating Tasks...");
	var tasks = [new Calendar(config.calendar, rConn), new Open311(config.open311, rConn)];
	console.log("Done.");
	
	console.log("Running Tasks...");
	var procs = [];
	for (var i = 0 ; i < tasks.length; i++) {
		procs.push(tasks[i].run.bind(tasks[i]));
	}
	
	async.series(procs, function (err, res) {
		if (err) return console.error("Failed.", err.stack);
		
		rConn.close(function (err) {
			if (err) return console.error("DB failed to close", err.stack);
			console.log("Done.");
		});
	});
});