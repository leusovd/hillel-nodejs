const { pushReqData } = require('../helpers/request-logger.js');

module.exports = (req, res, next) => {
	const afterResponse = () => {
		res.removeListener('finish', afterResponse);
		res.removeListener('close', afterResponse);

		pushReqData(req.headers['user-agent'], res.statusCode);
		
	}

	res.on('finish', afterResponse);
	res.on('close', afterResponse);

	next();
}