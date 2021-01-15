#!/usr/bin/env node

const pkg = require('../package.json');
const commander = require('commander');
const request = require('request');
const cheerio = require('cheerio');
const inquirer = require('inquirer');
const colors = require('colors');

console.log('song dex link complete');


commander
	.version(pkg.version)
	.option('-sn, --songName [name of song]', 'Search for lyrics of any song')
	.action((par)=>{
		console.log(par.songName);
		console.log('--------'.blue);
		do{
			songSearch(par.songName)
		}
		while(par.songName=='')
		console.log('---------'.green);
		/*const input = inquirer.prompt([
			{
				type: 'input',
				name: 'sampleInput',
				message: 'Enter some random message2'.red
			}
		])

		console.log(input.sampleInput);
		*/
	})
	.parse(process.argv);

//commander

const options = commander.opts();
//console.log(options.songName);


//songSearch('zen zen zense')

function songSearch(songName) {
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
		getLyrics(data.response.hits[0].result.path);
	});
}

function getLyrics(lyricsURL) {
	request(`https://genius.com${lyricsURL}`, (error, res, html) => {
		if (!error && res.statusCode == 200) {
			const $ = cheerio.load(html);
			const lyrics = $('.lyrics>p');
			console.log(lyrics.text());
		}
	});
}
