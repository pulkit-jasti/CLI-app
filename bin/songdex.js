#!/usr/bin/env node

const pkg = require('../package.json');
const commander = require('commander');
const request = require('request');
const cheerio = require('cheerio');
const inquirer = require('inquirer');
const colors = require('colors');
const fetch = require('node-fetch');

console.log('song dex link complete');

commander
	.version(pkg.version)
	.option('-sn, --songName [name of song]', 'Search for lyrics of any song')
	.action(par => {
		console.log(par.songName);
		console.log('--------'.blue);
		songSearch(par.songName);
	})
	.parse(process.argv);

//commander

const options = commander.opts();
//console.log(options.songName);

function line(num) {
	for (let i = 0; i < num; i++) {
		console.log('============================================================='.yellow);
	}
}

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
		line(1);
		console.log('SEARCH RESULTS'.green);
		line(1);
		for (let i = 0; i < 10; i++) {
			console.log(`${i + 1}. ${data.response.hits[i].result.title}`);
		}

		console.log('\n');
		inquirer
			.prompt([
				{
					type: 'input',
					name: 'searchIndex',
					message: 'Select an option'.red,
				},
			])
			.then(cb => {
				let index = parseInt(cb.searchIndex, 10) - 1;
				getSongInfo(data.response.hits[index].result);
			})
			.catch(err => console.log(err));

		return data;
	});
}

function getSongInfo(obj) {
	console.log('\n\n==============='.red);
	console.log('TITLE'.blue);
	console.log('===============\n'.red);
	console.log(obj.title);

	console.log('\n\n==============='.red);
	console.log('ARTIST'.blue);
	console.log('===============\n'.red);
	console.log(obj.primary_artist.name);

	console.log('\n\n==============='.red);
	console.log('LYRICS'.blue);
	console.log('===============\n'.red);
	fetch(`https://genius.com${obj.path}`)
		.then(res => res.text())
		.then(data => {
			const $ = cheerio.load(data);
			const lyrics = $('.lyrics>p');
			console.log(lyrics.text());
		})
		.catch(err => console.log(err));
}
