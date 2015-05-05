var Twit = require('twit'),
	r = require('rethinkdb'),
	config = require('./config');

var connection = null;

r.connect( {host: 'localhost', port: 28015}, function(err, conn) {
    if (err) throw err;
    connection = conn;
    app();
});


function app() {
	var Twitter = new Twit({
	  consumer_key:         config.twitter.consumer_key,
	  consumer_secret:      config.twitter.consumer_secret,
	  access_token:         config.twitter.access_token,
	  access_token_secret:  config.twitter.access_token_secret
	});
	
	var hashtags = config.twitter.hashtags;
	var stream = Twitter.stream('statuses/filter', { track: hashtags });

	r.table('requests').orderBy({index:r.desc('date')}).limit(2).changes().run(connection, function(err, cursor) {
	    if (err) throw err;
	    cursor.each(function(err, row) {
	    	console.log('changes');
	        if (err) throw err;
	        console.log(JSON.stringify(row, null, 2));
	    });
	});

	stream.on('tweet', function (tweet) {
	  	//console.log(tweet);

	  	console.log('insert');

		r.table('requests').insert([
		    { 
		    	date: r.now()
		    }
		]).run(connection, function(err, result) {
		    if (err) throw err;
		    //console.log(JSON.stringify(result, null, 2));
		});	
	});
}