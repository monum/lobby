// Setting up the database

var r = require('rethinkdb'),
	config = require('./config');

var connection = null;

r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    if (err) throw err;
    connection = conn;
    setup();
});

function setup(){
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

	r.db('test').tableCreate('tweets').run(connection, function(err){
		// Insert a Record
		r.table('tweets').insert([
		    { 
		    	date: r.now()
		    }
		]).run(connection, function(err, result) {
		    if (err) throw err;
		    //console.log(JSON.stringify(result, null, 2));
		});	
	});

	//Create an index

	r.table("tweets").indexCreate("date").run(connection, function(err){
		console.log(err);	
	});
}