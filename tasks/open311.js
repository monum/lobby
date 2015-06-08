/// <reference path="../typings/node/node.d.ts"/>

var assert = require('assert');
var util = require('util');
var path = require('path');

var Promise = require('promise');
var async = require('async');
var r = require('rethinkdb');
var request = require('request');

var Task = require('./Task');
var ServiceRequest = require('./models/ServiceRequest');

function Open311 (opts, rConn) {
	assert(typeof(opts) === "object", "Open311 expects an opts object as arg0");
	assert(typeof(opts.url) === "string", "Open311 expects opts.url to be a string");
	
	// defaults
	opts.perPage = opts.perPage || 500;
	opts.startPage = opts.startPage || 0;
	opts.endPage = opts.endPage || 2;
	opts.lastServiceId = opts.lastServiceId || "";
	
	assert(opts.startPage <= opts.endPage, "opts.startPage must be <= opts.endPage");
	
	// store the rConn locally, for use in run()
	this._conn = rConn;
	
	// store our options locally, for use in run()
	this._opts = opts;
}

util.inherits(Open311, Task);

// Our overriden run() method checks the Open311 for non-imported entries and imports them
Open311.prototype.run = function (cb) {
	assert(typeof(cb) === "function", "cb should be a function");
	
	// make all the page getters we need (one for each page)
	var pageGetters = [];
	for (var i = this._opts.startPage ; i < this._opts.endPage; i++) {
		pageGetters.push(processPage.bind(this, i));
	}
	
	// pointer to self
	var self = this;
	
	// run them all at once
	async.parallel(pageGetters, function (err, res) {
		if (err) return cb(err);
		
		// check for any bad status codes
		var failed = res.filter(function (v) { return !v || v.statusCode.toString().indexOf("2") !== 0; });
		
		// handle bad status codes
		if (failed.length > 0) {
			var msg = "The following requests yielded non 2XX status codes: ";
			for (var i = 0 ; i < failed.length ; i++) {
				if (typeof(failed[i]) === "undefined") {
					msg += failed[i]+ ", ";
				} else {
					msg += path.normalize(self._opts.url + "/?per_page="+self._opts.perPage+"&page=" + failed[i].page +", ");
				}
			}
			return cb(new Error(msg));
		}
		
		// all is well, finish processing and trigger cb
		getServiceRequests(res)
			.then(removeDuplicates)
			.then(writeToDb.bind(self))
			.done(cb.bind(self, null), cb.bind(self));
	});
};

// Goes and gets a page of open311 data, and calls cb when finished
// since async.parallel() calls this function, cb is passed by that library
function processPage (page, cb) {
	Promise.denodeify(request)({url: this._opts.url, qs:{
		page: page,
		page_size: this._opts.perPage
	}})
		.then(function (res) {
			res.page = page; // map in the page property in case of statusCode errors
			return res;
		})
		.done(cb.bind(this, null), cb.bind(this));
};

// takes data => [response, response, ...], returns Promise that resolves to requests => array of ServiceRequest
function getServiceRequests (data) {
	return new Promise(function (resolve, reject) {
		var res = [];
		for (var i = 0 ; i < data.length ; i++) {
			var parsed = JSON.parse(data[i].body);
			for (var j = 0 ; j < parsed.length; j++) {
				res.push(new ServiceRequest(parsed[j]));
			}
		}
		resolve(res);
	});
}

// takes reqeuests => array of ServiceRequest, returns requests => array of ServiceRequest
function removeDuplicates (requests) {
	var hash = {};
	var res = requests.filter(function (v) { if (hash[v.serviceRequestId]) return false; else hash[v.serviceRequestId] = true; return true; });
	delete hash;
	return res;
}

// takes requests => array of ServiceRequest, returns operation status
function writeToDb (requests) {
	// pointer to self
	var self = this;
	
	return new Promise(function (resolve, reject) {
		r.db('open311').table("requests").delete().run(self._conn, function (err) {
			if (err) return reject(err);
			r.db('open311').table("requests").insert(requests).run(self._conn, function (err) {
				if (err) return reject(err);
				return resolve();
			});
		});
	});
}

// Export our functionality
module.exports = Open311;