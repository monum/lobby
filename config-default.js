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

// Setup calendar configuration to pull the ical into our database
config.calendar = {
	url: 'http://www.trumba.com/calendars/cob-calendar.ics' // defaults to city of boston events calendar
};

// Setup open311 configuration to pull mayor's dashboard information into our database
config.open311 = {
	url: 'https://mayors24.cityofboston.gov/open311/v2/requests.json?extensions=v1', // defaults to city of boston open311 data endpoint
	perPage: 500,
	startPage: 0,
	endPage: 2,
	lastServiceId: "" // tells the task to stop when it sees lastServiceId, as anything previous to that is considered already in the database
};

module.exports = config;