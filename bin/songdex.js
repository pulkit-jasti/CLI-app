#!/usr/bin/env node

const pkg = require('../package.json');
const commander = require('commander');
const cheerio = require('cheerio');
const inquirer = require('inquirer');
const colors = require('colors');
const fetch = require('node-fetch');

commander
	.version(pkg.version)
	.option('-s, --search [Track/Artist/Album]', 'Search for music based on ')
	.action(par => {
		songSearch(par.search);
	})
	.parse(process.argv);

function songSearch(songName) {
	fetch(`https://genius.p.rapidapi.com/search?q=${songName}`, {
		method: 'GET',
		headers: {
			'x-rapidapi-key': 'c5197c28abmsh1312fd9536ea6eep14a057jsnedfce82aaea2',
			'x-rapidapi-host': 'genius.p.rapidapi.com',
		},
	})
		.then(res => res.json())
		.then(data => {
			console.log('============================================================='.yellow);
			console.log('SEARCH RESULTS'.green);
			console.log('============================================================='.yellow);

			let i = 1;
			data.response.hits.forEach(element => {
				console.log(`${i++}. ${element.result.title}`);
			});

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
		})
		.catch(err => console.error(err));
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
