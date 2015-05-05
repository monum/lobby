var config = {};

//Web Config
config.web = {
	port:4040
};

// Setup Twitter API access. Find keys, token, and secrets at apps.twitter.com.
config.twitter = {
	consumer_key:'',
	consumer_secret:'',
	access_token:'',
	access_token_secret:'',
	hashtags:[''] //Use the hashtags you would be to track.
};

module.exports = config;