const fetch = require('node-fetch');
const cheerio = require('cheerio');

const extractUUID = require('./extract-uuid');
const googleRoot = `https://www.google.co.uk/search?q=`;

function parseHTML(html){
	// console.log(html);
	return Promise.resolve( cheerio.load(html) );	
}

const wait = function(ms){
	return new Promise(resolve => { setTimeout(resolve(), ms) });
}
module.exports = function(query){

	//https://www.google.co.uk/search?q=Tone+down+the+hatred+and+retain+your+dignity

	const requestURL = `${googleRoot}${encodeURIComponent(query)}+site:www.ft.com`;
	// console.log(requestURL);

	// return requestURL;

	const delay = (Math.random() * 60000) | 0;

	console.log(delay);

	return wait( (Math.random() * 60000) | 0)
		.then(function(){
			// console.log(requestURL);
			return requestURL
			// return fetch(requestURL);
		})
		/*.then(res => {
			console.log(res.status);
			return res;
		})
		.then(res => res.text())
		.then(body => parseHTML(body))
		.then($ => {
			// console.log(el);
			const FTlink = $('#search #ires ol .g > .s > .kv cite').first().text();
			return extractUUID(FTlink);
		})*/
	;

}