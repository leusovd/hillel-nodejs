const path = require('path');
const { createReadStream } = require('fs');

const routeParser = require('./helpers/route-parser.js');
const bodyHandler = require('./helpers/body-handler.js');
const assetsController = require('./controllers/assets-controller.js');
const messages = require('./controllers/messages-controller.js');
const index = require('./views/index.js');

const routes = {
	'GET': {

		'': (response, { resolve }) => {
			const doc = index();
			
			response.setHeader('Content-Type', 'text/html; charset=utf-8;');
			response.write(doc);
			response.end();
	
			resolve({statusCode: 200});
		},
	
		'favicon.ico': (response, { resolve }) => {
			const rs = createReadStream(path.join(__dirname, 'assets', 'Smile.png'));
			rs.on('open', () => {
				response.writeHead(200, {'Content-Type': 'image/png'});
				rs.pipe(response);
	
				resolve({statusCode: 200});
			});	
		},

		'assets': assetsController,

		'messages': messages.get

	},

	'POST': {
		'messages': messages.post
	},

	'PUT': {
		'messages': messages.put
	},

	'DELETE': {
		'messages': messages.delete
	}

}

module.exports = function router(req, res) {

	const parsedRoute = routeParser(req);
	const { segments, method } = parsedRoute;

	return new Promise((resolve) => {

		if (routes[method].hasOwnProperty(segments[0])) {

			if (method === 'POST' || method === 'PUT') {
				bodyHandler(req, body => {
					routes[method][segments[0]](res, { resolve, body, parsedRoute });
				});
			} else {
				routes[method][segments[0]](res, { resolve, parsedRoute });
			}			

		} else {
			const statusCode = 404;
			const message = 'Not Found';

			res.statusCode = statusCode;
			res.end(message);

			resolve({statusCode, message});
		}
		
	});

}