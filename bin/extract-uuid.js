const isUUID = require('is-uuid');

module.exports = function(str){

	let UUIDString = str;

	let uuidRegex = /([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i;
	let matchedUUID = uuidRegex.exec(UUIDString);

	UUIDString = matchedUUID ? matchedUUID[1] : null; 

	if(!UUIDString || !isUUID.anyNonNil(UUIDString)){
		return Promise.reject("Not a valid UUID");
	} else {
		return Promise.resolve(UUIDString);
	}

}