// Setting up the database

var r = require('rethinkdb'),
	async = require('async'),
	config = require('./config-default');

r.connect( {host: config.r.host, port: config.r.port}, function(err, conn) {
    if (err) throw err;
    setup(conn);
});

function setup(conn) {
	// Create a database
	/*
	r.dbCreate('lobby').run(connection, function(err){
		console.log(err);
	});

	// Create a table
	r.db('lobby').tableCreate('tweets').run(connection, function(err){
		console.log(err);
	});
	*/
	async.series([
		function (cb) {
			r.dbCreate('calendar').run(conn, function (err) {
				if (err) return console.error(err);
				r.db('calendar').tableCreate('events').run(conn, function (err) {
					if (err) return console.error(err);
					cb(null);
				});
			});
		}, function (cb) {
			r.dbCreate('open311').run(conn, function (err) {
				if (err) return console.error(err);
				r.db('open311').tableCreate('requests').run(conn, function (err) {
					if (err) return console.error(err);
					cb(null);	
				});
			});
		}], function (err, res) {
			if (err) console.error("could not setup db", err);
			else console.log("db setup");
			conn.close();
		});
	
	// r.db('test').tableCreate('tweets').run(connection, function(err){
	// 	// Insert a Record
	// 	r.table('tweets').insert([
	// 	    { 
	// 	    	date: r.now()
	// 	    }
	// 	]).run(connection, function(err, result) {
	// 	    if (err) throw err;
	// 	    //console.log(JSON.stringify(result, null, 2));
	// 	});	
	// });

	// //Create an index

	// r.table("tweets").indexCreate("date").run(connection, function(err){
	// 	console.log(err);	
	// });
}