const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const params = {
	deep: null,
	ext: null
};

function recursive(currentPath, level = 0) {
	let dirent;

	try {
		dirent = fs.readdirSync(currentPath, {
			withFileTypes: true
		});
	} catch (error) {
		console.log(chalk.red(error));
		return;
	}

	let i = 0;

	// Directory name heading
	const dirPrefix = !level ? '' : ''.padStart(level, '+');
	console.log(chalk.bold(`${dirPrefix}Files from ${currentPath}:`));

	while (true) {
		if (!dirent.length || i === dirent.length) break;

		// Check if entry is a file
		// And which of extensions to show
		// Then output it into the console
		if (
			dirent[i].isFile() &&
			(ext.includes(path.extname(dirent[i].name)) || !params.ext.length)
		) {
			const filePrefix = dirPrefix.replace(/\+/g, '-');
			console.log(filePrefix + dirent[i].name);
		}

		// Recursive view of inner directories
		if (dirent[i].isDirectory() && ++level !== params.deep) {
			recursive(currentPath + path.sep + dirent[i].name, level++);
		}

		i++;
	}
};

module.exports = function showFiles(dirPath, deep, ext) {
	dirPath =	typeof dirPath === 'string' &&
			(path.isAbsolute(dirPath) ? dirPath : path.join(__dirname, dirPath)) ||	('.' + path.sep);
	params.deep = typeof deep === 'number' && deep || 0;
	params.ext = Array.isArray(ext) && ext || [];

	console.log(chalk.bold('------------------------------------'));
	console.log(chalk.bold('        RECURSIVE DIR VIEW          '));
	console.log(chalk.bold('------------------------------------'));

	recursive(dirPath);
};