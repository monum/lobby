
// Represents a single ServiceRequest from https://mayors24.cityofboston.gov/open311/v2/requests.json?extensions=v1&status=open
function ServiceRequest (serviceRequestObject) {
	var e = serviceRequestObject;
	
	this.serviceRequestId = e.serviceRequestId || e.service_request_id;
	this.status = e.status;
	this.serviceName = e.serviceName || e.service_name;
	this.serviceCode = e.serviceCode || e.service_code;
	this.description = e.description;
	this.requestedDateTime = e.requestedDateTime || new Date(e.requested_datetime);
	this.updatedDateTime = e.updatedDateTime || new Date(e.updated_datetime);
	this.address = e.address;
	this.lat = e.lat;
	this.long = e.long;
	this.mediaUrl = e.mediaUrl || e.media_url;
	this.extendedAttributes = e.extendedAttributes || e.extended_attributes;
}

ServiceRequest.prototype.serviceRequestId = "";
ServiceRequest.prototype.status = "";
ServiceRequest.prototype.serviceName = "";
ServiceRequest.prototype.serviceCode = "";
ServiceRequest.prototype.description = "";
ServiceRequest.prototype.requestedDateTime = null;
ServiceRequest.prototype.updatedDateTime = null;
ServiceRequest.prototype.address = "";
ServiceRequest.prototype.lat = 0;
ServiceRequest.prototype.long = 0;
ServiceRequest.prototype.mediaUrl = "";
ServiceRequest.prototype.extendedAttributes = {}; // here there be dragons


module.exports = ServiceRequest;