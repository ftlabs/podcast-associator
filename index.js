const fetch = require('node-fetch');
const xml2js = require('xml2js');
const morar = require('morar-client').config({
    token : '111cddbca2e9453ba06e62bd0a98512e',
    name : 'listen to lucy podcast association'
});

const parseXML = require('./bin/from-xml');
const sapi = require('./bin/sapi');
const levenshtein = require('./bin/levenshtein');

let gResults = [];

fetch('http://rss.acast.com/ft-lucy-kellaway')
	.then(res => res.text())
	.then(FEED => parseXML(FEED))
	.then(data => {

		const podcasts = data.rss.channel[0].item;

		const rejects = [];

		sapi('lucy kellaway')
			.then(data => {
					// console.log(data.length, " results");

					const items = data;

					podcasts.forEach(cast => {

						var minDistance = 1000;
						var relevantItem = undefined;

						items.forEach(item => {
							const l = levenshtein(cast.title[0], item.title.title);

							if(l < minDistance && l <= 15 && (l !== cast.title[0].length || l !== item.title.title.length ) ){
								minDistance = l;
								relevantItem = item;
							}
						})

						if(relevantItem !== undefined){
							// console.log(cast.title[0], '=>', relevantItem.title.title, ':', relevantItem.id, minDistance);

							gResults.push({
								cast,
								article : relevantItem,
								lDistance : minDistance
							});

						} else {
							rejects.push(cast.title[0]);
						}

					});

					const nr = gResults.sort( function (a,b) {
						if (a.lDistance < b.lDistance)
							return -1;
						if (a.lDistance > b.lDistance)
							return 1;
						return 0;
						}
					);

					nr.forEach(i => {
						// console.log(i.cast.title[0], '=>', i.article.title.title, i.article.id, i.lDistance);
						// console.log(`${i.cast.enclosure[0].$.url} => https://ft.com/content/${i.article.id}`);
						morar(i);
					});


				});

			})
		;
;