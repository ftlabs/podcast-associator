const XML2JS = require('xml2js');
const parseXML = XML2JS.parseString;


module.exports = function(text){

	return new Promise( (resolve, reject) => {
		parseXML(text, (err, result) => {
			if(err) {
				reject(err);
			} else {
				resolve(result);
			}
		}) 
	});

}