const fetch = require('node-fetch');

/*
curl -X POST -H 'Content-Type: application/json' -H 'Cache-Control: no-cache' -H 'Postman-Token: 39b701b5-158b-4c15-8f0f-3be801653a5a' -d '{
    'queryString':'authors:\'Lucy Kellaway\'',
    'queryContext':{
    'curations':['ARTICLES']
},
    'resultContext':{
    'aspects' : ['title'],
    'maxResults':100,
    'offset': 100
}}' 'http://search.ft.com/search-services/search'
*/

function buildRequest (author, offset) {
	return  fetch('http://search.ft.com/search-services/search', {
			headers : {
				'Content-Type' : 'application/json'
			},
			body : JSON.stringify({
					'queryString' : `authors:'${author}'`,
					'queryContext' : {
					'curations' : ['ARTICLES']
				},
					'resultContext':{
					'aspects' : ['title'],
					'maxResults':100,
					'offset': offset
				}
			}),
			method : 'POST'
		})
		.then(res => res.json())
	;
}

module.exports = function(author){

	const bulkResults = [];
	let numberOfResults = 0;
	let numberOfRequests = 0;

	return new Promise( (resolve, reject) => {

		buildRequest(author, 0)
			.then(data => {
				
				if(data.results[0].indexCount > numberOfResults){
					numberOfResults = data.results[0].indexCount;
					numberOfRequests = Math.ceil(numberOfResults / 100);
				}

				data.results[0].results.forEach(r => {
					bulkResults.push(r);
				});

				const reqsToMake = [];

				for(var x = 1; x < numberOfRequests; x += 1){
					reqsToMake.push( buildRequest(author, 100 * x) );
				}

				Promise.all(reqsToMake)
					.then(results => {

						results.forEach(result => {
							result.results[0].results.forEach(r => {
								bulkResults.push(r);
							})
						});

						// console.log(bulkResults);
						resolve(bulkResults);

					})
				;

			})
		;


	});


};