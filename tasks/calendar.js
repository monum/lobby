/// <reference path="../typings/node.d.ts"/>

var assert = require('assert');
var util = require('util');

var Promise = require('promise');
var r = require('rethinkdb');
var ical = require('ical');

var Task = require('./Task');
var Event = require('./models/Event');

function Calendar (opts, rConn) {
	assert(typeof(opts) === "object", "Calendar expects an opts object as arg0");
	assert(typeof(opts.url) === "string", "Calendar expects opts.url to be a string");
	
	// store the rConn locally, for use in run()
	this._conn = rConn;
	
	// store our options locally, for use in run()
	this._opts = opts;
}

util.inherits(Calendar, Task);

// Our overriden run() method checks the calendar for non-imported entries and imports them
Calendar.prototype.run = function (cb) {
	assert(typeof(cb) === "function", "cb should be a function");
	
	Promise.denodeify(ical.fromURL)(this._opts.url, {})
		.then(getCityHallEvents)
		.then(removeDuplicates)
		.then(writeToDb.bind(this))
		.done(cb.bind(this,null), cb.bind(this));
};

// takes data => ical data, returns events => array of Event
function getCityHallEvents (data) {
	var res = [];
	for (var prop in data) {
		if (data.hasOwnProperty(prop) && data[prop].type.toUpperCase() === "VEVENT") {
			res.push(new Event(data[prop]));
		}
	}
	return res;
}

// takes events => array of Event, returns events => array of Event
function removeDuplicates (events) {
	var hash = {};
	var res = events.filter(function (v) { if (hash[v.uid]) return false; else hash[v.uid] = true; return true; });
	delete hash;
	return res;
}

// takes events => array of Event, returns operation status
function writeToDb (events) {
	// pointer to self
	var self = this;
	
	return new Promise(function (resolve, reject) {
		r.db('calendar').table("events").delete().run(self._conn, function (err) {
			if (err) return reject(err);
			r.db('calendar').table("events").insert(events).run(self._conn, function (err) {
				if (err) return reject(err);
				return resolve();
			});
		});
	});
}

// Export our functionality
module.exports = Calendar;