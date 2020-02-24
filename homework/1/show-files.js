const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

module.exports = function showFiles(relPath, deep = 0, colors = [], ext = []) {
	if (relPath === void 0 || !relPath) {
		throw new TypeError('Path is not defined.');
	}

	let c = 0; // color index

	console.log(chalk.bold('------------------------------------'));
	console.log(chalk.bold('        RECURSIVE DIR VIEW          '));
	console.log(chalk.bold('------------------------------------'));

	const recursive = (relPath, level = 0) => {
		const absPath = path.join(__dirname, relPath);
		let dirent;

		try {
			dirent = fs.readdirSync(absPath, {
				withFileTypes: true
			});
		} catch (error) {
			console.log(chalk.red(error));
			return;
		}

		let i = 0;

		// Directory name heading
		const dirPrefix = !level ? '' : ''.padStart(level, '+');
		console.log(chalk.bold(`${dirPrefix}Files from ${relPath}:`));

		while (true) {
			if (!dirent.length || i === dirent.length) break;

			// Check if entry is a file 
			// And which of extensions to show
			// Then output it into the console
			if (
				dirent[i].isFile() &&
				(ext.includes(path.extname(dirent[i].name)) || !ext.length)
			) {
				// Colored or simple output
				const output = colors.length ?
					chalk.keyword(colors[c])(dirent[i].name) :
					dirent[i].name;

				const filePrefix = dirPrefix.replace(/\+/g, '-');
				console.log(filePrefix + output);

				if (colors.length) {
					c = c === colors.length - 1 ? 0 : c + 1;
				}
			}

			// Recursive view of inner directories
			if (dirent[i].isDirectory() && ++level !== deep) {
				recursive(relPath + '/' + dirent[i].name, level++);
			}

			i++;
		}
	};

	recursive(relPath);
};;