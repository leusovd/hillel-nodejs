const { createReadStream, createWriteStream, existsSync } = require('fs');
const path = require('path');
const ft = require('file-type');
const { writeLog } = require('../helpers/log');

module.exports = function(response, { resolve, parsedRoute }) {
	const filePath = path.join(__dirname, '..', parsedRoute.segments.join('/'));
	const fileName = path.parse(filePath).base;

	// Check file existance
	if (!existsSync(filePath)) {
		const statusCode = 404;
		const message = 'File not found.';

		response.statusCode = statusCode;
		response.end(message);

		resolve({statusCode, message});
		return;
	}

	// Log that file fetch has been started
	const startDate = new Date();
	writeLog(`${fileName} fetch started.`, 'assets');

	// Start streaming
	const rs = createReadStream(filePath);

	rs.once('data', async chunk => {
		
		let fileType = await ft.fromBuffer(chunk);

		if (!fileType) {
			const extname = path.extname(filePath);

			if (extname === '.css') {
				fileType = { mime: 'text/css' }
			} else if (extname === '.js') {
				fileType = { mime: 'text/javascript' }
			}
		}

		response.setHeader('Content-Type', fileType.mime);
		response.write(chunk);
		rs.pipe(response);          
	});	

	// Response completion listeners
	let isFinished = false;

	const finishListener = (statusCode = 200, success = true) => {
		const endDate = new Date();
		const message = success ? `${fileName} fetch ended with success. Time: ${endDate - startDate}ms` :
			`${fileName} fetch is terminated by the client. Time: ${enDate - startDate}ms`;

		writeLog(message, 'assets');

		resolve({statusCode, message});
		isFinished = true;
	}

	response.once('finish', finishListener);

	response.once('close', () => {
		response.removeListener('finish', finishListener);
		if (!isFinished) finishListener(400, false);
	});		
}