const commander = require('commander');
const track = require('../commands/track');

commander.command('lyrics').description('Gets the lyrics of the track').action(track.lyrics);

commander.parse(process.argv);
