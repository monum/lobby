/// <reference path="../typings/node/node.d.ts"/>
/// <reference path="../typings/mocha/mocha.d.ts"/>

var assert = require('assert');
var util = require('util');

var CronJob = require('cron').CronJob;

var Task = require('../tasks/Task');

// Use mocha to describe our desired behavior
describe("Task", function () {
	
	// This verifies that a direct instantiation of "abstract class" Task throws when it's run() is called
	it("should throw if run isn't implemented", function () {
		var instance = new Task();
		
		assert.throws(function () {
			instance.run();
		}, function (err) {
			if ((err instanceof Error) && /Derived class should implement/.test(err)) {
				return true;
			}
		}, "default run() didn't throw");
	});
	
	// This verifies that a direct instantiation of "abstract class" Task throws on start() when given a non-string and/or a non-function
	it("should throw if start arguments are invalid", function () {
		var instance = new Task();
		
		assert.throws(function () {
			instance.start(123, function(){});
		}, function (err) {
			if ((err instanceof Error) && /should be a/.test(err)) {
				return true;
			}
		}, "default start() didn't throw");
		
		assert.throws(function () {
			instance.start("", 123);
		}, function (err) {
			if ((err instanceof Error) && /should be a/.test(err)) {
				return true;
			}
		}, "default start() didn't throw");
		
		assert.throws(function () {
			instance.start();
		}, function (err) {
			if ((err instanceof Error) && /should be a/.test(err)) {
				return true;
			}
		}, "default start() didn't throw");
	});
	
	// This verifies that a direct instantiation of "abstract class" Task actually creates a CronJob on start()
	it("should create a CronJob when start is called", function () {
		var instance = new Task();
		instance.start("", function() {});
		assert(instance._job instanceof CronJob, "instance._job should be a CronJob");
	});
	
	// This verifies that a direct instantiation of "abstract class" Task actually destroys it's CronJob on stop()
	it("should destroy CronJob when stop is called", function () {
		var instance = new Task();
		instance.start("", function() {});
		assert(instance._job instanceof CronJob, "instance._job should be a CronJob");
		instance.stop();
		assert(typeof(instance._job) === "undefined", "instance._job should be undefined");
	});
	
	// This verifies that an instance of a "class" derived from "abstract class" Task supports overriding of run()
	// This test is ASYNC and doesn't end until done() is called.
	it("should allow overriding of run via derivation", function (done) {
		function Derived() {
		};
		
		// due to how util.inherits() works, ordering of this and Dervied.prototype.run() definition is important
		util.inherits(Derived, Task);

		// override run() with our custom implementation
		Derived.prototype.run = function (cb) {
			assert(typeof(cb) === "function", "cb should be a function");
			cb(null, "OK");
		};
		
		var instance = new Derived();
		
		instance.run(function (err, res) {
			assert(err === null, "err should be null");
			assert(res === "OK", "res should be 'OK'");
			done();
		});
	});
});