
// Represents a single Event from an ical entry, specifically one like http://www.cityofboston.gov/calendar/
function Event (eventObject) {
	var e = eventObject;
	
	this.TZID = e.TZID || e.tzid || "";
	this.summary = e.summary || e.SUMMARY || "";
	this.location = e.location || e.LOCATION || "";
	this.start = e.start || new Date(e.DTSTART);
	this.end = e.end || new Date(e.DTEND);
	this.description = e.description || e.DESCRIPTION || "";
	this.categories = e.categories || (typeof(e.CATEGORIES) === "undefined") ? [] : e.CATEGORIES.split(",");
	this.uid = e.uid || e.UID || "";
}

Event.prototype.TZID = "";
Event.prototype.summary = "";
Event.prototype.location = "";
Event.prototype.start = null;
Event.prototype.end = null;
Event.prototype.description = "";
Event.prototype.categories = [];
Event.prototype.uid = "";

module.exports = Event;