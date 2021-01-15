#!/usr/bin/env node

const pkg = require('../package.json');
const request = require('request');
const cheerio = require('cheerio');
const commander = require('commander');

commander.version(pkg.version).command('track', 'Search for tracks').parse(process.argv);

console.log('song dex link complete');

songName = 'grand escape';

const options = {
	method: 'GET',
	url: 'https://genius.p.rapidapi.com/search',
	qs: { q: songName },
	headers: {
		'x-rapidapi-key': 'c5197c28abmsh1312fd9536ea6eep14a057jsnedfce82aaea2',
		'x-rapidapi-host': 'genius.p.rapidapi.com',
		useQueryString: true,
	},
};

request(options, function (error, response, body) {
	if (error) throw new Error(error);

	const data = JSON.parse(body);
	//console.log(data.response.hits[0].result.path);
	console.log('\n\n\n');
	getLyrics(data.response.hits[0].result.path);
});

function getLyrics(lyricsURL) {
	var lyr;
	request(`https://genius.com${lyricsURL}`, (error, res, html) => {
		if (!error && res.statusCode == 200) {
			var $ = cheerio.load(html);
			lyr = $('.lyrics>p');
			console.log(lyr.text());
		}
	});
}
