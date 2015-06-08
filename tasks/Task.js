/// <reference path="../typings/node/node.d.ts"/>

var assert = require('assert'),
	CronJob = require('cron').CronJob;


// The constructor for a task object
function Task() {
	
}

// Run the task, and call cb with (err, res)
//
// err instanceof Error || null
// typeof(res) === "object" || null
//
// Naturally, res will vary alot based on the task you're calling
Task.prototype.run = function (cb) {
	throw new Error("Derived class should implement run()");
};

// Run the task on a schedule (given a cron string), and call cb with (err, res) on each run
//
// err instanceof Error || null
// typeof(res) === "object" || null
//
// Naturally, res will vary alot based on the task you're calling
//
// Returns: undefined
Task.prototype.start = function (cronString, cb) {
	assert(typeof(cronString) === "string", "cronString should be a string");
	assert(typeof(cb) === "function", "cb should be a function");
	
	// if there's an old job, kill it
	this.stop();
	
	// create the job
	this._job = new CronJob(cronString, this.run.bind(this, cb));
	
	// start it
	this._job.start();
};

// If the task was scheduled, clear the schedule (and therefore any internal loops)
// You should call this if you call start(), and expect your application to stop naturally
//
// Returns: undefined
Task.prototype.stop = function () {
	if (this._job) {
		this._job.stop();
		delete this._job;
	}
};

// Export our constructor
module.exports = Task;