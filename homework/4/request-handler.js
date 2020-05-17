const router = require('./router.js');
const { writeLog } = require('./helpers/log.js');

const requests = [];

exports.setIntervalLogging = function () {
	setInterval(() => {
		if (requests.length) {

			requests.forEach(request => {				
				const reqItemKeys = Object.keys(request);

				let	message = `User agent: ${request['user-agent']}`;

				reqItemKeys.forEach(key => {
					if (key !== 'user-agent') {
						message += `, ${key}: ${request[key]}`;
					}
				});				
				
				writeLog(message, 'requests');		
			});	

		}
	}, 60000);
}

exports.requestHandler = function (req, res) {
	const ua = req.headers['user-agent'];

	// console.log(route.pathname, method, otherSegments);

	router(req, res)
	.then(data => {

		const request = requests.find(item => item['user-agent'] === ua);

		if (request) {
			
			if (request.hasOwnProperty(data.statusCode)) {
				request[data.statusCode]++;
			} else {
				request[data.statusCode] = 1;
			}

		} else {
			requests.push({
				'user-agent': ua,
				[data.statusCode]: 1
			})
		}

	});

}