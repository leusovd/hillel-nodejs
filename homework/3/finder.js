const EventEmitter = require('events');
const path = require('path');
const { homedir } = require('os');
const fs = require('fs');
const { promisify } = require('util');
const ft = require('file-type');
const { pathChecker } = require('./helpers.js');
const readdirp = promisify(fs.readdir);
const { Writable } = require('stream');
const { Buffer } = require('buffer');

const INTERVAL = 2000;

module.exports = class Finder extends EventEmitter {
	constructor(dir, deep, name, search) {
		super();

		this.dir =
			(typeof dir === 'string' &&
				(path.isAbsolute(dir)
					? dir
					: path.join(__dirname, dir.replace(/\'/g, '')))) ||
			homedir();
		this.deep = (typeof deep === 'number' && deep) || 0;
		this.name = (typeof name === 'string' && name) || '';
		this.search = (typeof search === 'string' && search) || '';

		this.logFilePath = null;

		this.timePassed = 0;
		this.i = 100;
		this.timer = null;

		this.dirsChecked = 0;
		this.filesChecked = 0;

		// Emit events after listeners have been added
		process.nextTick(() => {
			this.emit('started');
			console.time('Search Time');
		});
	}

	createLog() {
		this.logFilePath = path.join(__dirname, 'logs', Date.now() + '.log');

		if (!fs.existsSync(path.join(__dirname, 'logs'))) {
			fs.mkdirSync(path.join(__dirname, 'logs'));
		}

		fs.appendFileSync(this.logFilePath, '');

		this.writable = fs.createWriteStream(this.logFilePath);

		console.log('Log file has been created!');
	}

	async parse() {
		this.createLog();

		this.setTimer();

		// Main logic
		try {
			await this.recursive(this.dir);
		} catch (e) {
			this.emit('error', e);
		}

		// Close the stream
		this.writable.end();

		// Parsing has been finished
		clearTimeout(this.timer);
		this.emit('finished');
		console.timeEnd('Search Time');
	}

	async recursive(currentPath, level = 0) {
		let checked = false;

		// Get promise with a list of dirents
		const direntList = await readdirp(currentPath, { withFileTypes: true });

		for (let dirent of direntList) {
			if (
				dirent.isFile() &&
				(pathChecker(dirent.name, this.name) || !this.name.length)
			) {
					this.setTimer();

					// Increment count of checked files that accept defined criterias
					this.filesChecked++;

					// Increment count of checked directories that accept defined criterias
					if (!checked) this.dirsChecked++;

					// Check file content
					try {
						await this.searchInFile(path.join(currentPath, dirent.name));
					} catch (e) {
						if (!/End-Of-Stream/g.test(e)) {
							console.log(e);
						}
					}

					this.emit('file', {
						filePath: path.join(currentPath, dirent.name)
					});

					this.timePassed = 0;
				} else if (dirent.isDirectory() && ++level !== this.deep) {
				try {
					await this.recursive(path.join(currentPath, dirent.name), level++);
				} catch (err) {
					this.emit('error', e);
					return;
				}
			}
		}
	}

	setTimer() {
		if (this.timer) {
			clearTimeout(this.timer);
		} else {
			this.timer = setTimeout(() => {
				this.emit('processing', {
					dirsChecked: this.dirsChecked,
					filesChecked: this.filesChecked
				});
				this.setTimer();
			}, INTERVAL);
		}
	}

	async searchInFile(pathToFile) {

		const stream = fs.createReadStream(pathToFile, { start: 0, end: 4100 });

		for await (let chunk of stream) {

			const filType = await ft.fromBuffer(chunk);
			
			if (
				path.extname(pathToFile) === '.js' ||
				path.extname(pathToFile) === '.json' ||
				path.extname(pathToFile) === '.txt' ||
				(filType && (/^text/g).test(filType.mime))
			) {
					const str = chunk.toString();
					const index = +str.search(new RegExp(this.search, 'g'));

					if (index !== -1) {

						const symbolsBefore =
							index > 20 ? str.slice(index - 20, index) : str.slice(0, index);

						const symbolsAfter =
							str.length > index + 20
								? str.slice(index, index + 20)
								: str.slice(index);

						const data = `\npath: ${pathToFile}\nsymbolsBefore: ${symbolsBefore}\nsymbolsAfter: ${symbolsAfter}\n`;

						this.writable.write(Buffer.from(data, 'utf8'));
					}
				}
		}
	}
}