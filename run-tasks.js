var async = require('async');

var Calendar = require('./tasks/calendar');
var Open311 = require('./tasks/open311');

var config = require('./config-default');

console.log("Creating Tasks...");
var tasks = [new Calendar(config.calendar), new Open311(config.open311)];
console.log("Done.");

console.log("Running Tasks...");
var procs = [];
for (var i = 0 ; i < tasks.length; i++) {
	procs.push(tasks[i].run.bind(tasks[i]));
}

async.series(procs, function (err, res) {
	if (err) return console.error("Failed.", err.stack);
	
	console.log("Done.");
});