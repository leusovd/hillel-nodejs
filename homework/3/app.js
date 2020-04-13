require('./logger.js');
const { getArgs, getExtEnv } = require('./helpers.js');
const Finder = require('./finder.js');

const { path, deep, search, name } = getArgs();

const finder = new Finder(path, deep, name, search);

finder.on('started', () => {
	console.log('FINDER STARTED!');
	finder.parse();
});

finder.on('file', data => {
	console.log(data.filePath);
});

finder.on('processing', data => {
	const { dirsChecked, filesChecked } = data;
	console.log(`PROCESSING... Dirs checked: ${dirsChecked}, Files checked: ${filesChecked}`);
});

finder.on('finished', () => {
	console.log('FINDER FINISHED');
});