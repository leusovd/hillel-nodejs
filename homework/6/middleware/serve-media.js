const path = require('path');
const { existsSync } = require('fs');
const { writeLog } = require('../helpers/log.js');


module.exports = (req, res, next) => {
	const fileExt = path.extname(req.path);

	if (
		fileExt &&
		(fileExt === '.png' || fileExt === '.jpg' || fileExt === '.mp4')) {
			const filePath = path.join(__dirname, '..', 'assets', req.path);
			const fileName = path.basename(filePath);

			if (!existsSync(filePath)) {
				const statusCode = 404;
				const message = 'File not found.';
		
				res.status(statusCode).json({
					status: 'error',
					message
				});
				return;
			}
			

			// Log that file fetch has been started
			const startDate = new Date();
			writeLog(`${fileName} fetch started.`, 'assets');

			res.status(200).sendFile(filePath, err => {
				if (err) {
					const endDate = new Date();
					const message = `${fileName} fetch is terminated by the client. Time: ${endDate - startDate}ms`;
					writeLog(message, 'assets');
				} else {
					const endDate = new Date();
					const message = `${fileName} fetch ended with success. Time: ${endDate - startDate}ms`;					
					writeLog(message, 'assets');
				}
			});

	} else {
		next();
	}
}