const messageService = require('../services/message-service.js');
const Message = require('../models/message.js');

exports.get = function (res, { resolve, parsedRoute }) {

	if (parsedRoute.segments.length === 1) {

		const allMessages = messageService.getAll(parsedRoute.params);
		const statusCode = 200;

		res.setHeader('Content-Type', 'application/json;charset=utf8;');
		res.statusCode = statusCode;
		res.write(JSON.stringify({
			status: 'ok',
			content: allMessages
		}));
		res.end();
		resolve({statusCode});

	} else if (!isNaN(+parsedRoute[1])) {

		const id = parseInt(parsedRoute.segments[1]);
		const message = messageService.getById(id);

		if (!message) {
			const statusCode = 404;
			res.statusCode = statusCode;
			res.end('Message not found.');
			resolve({statusCode});
			return;
		}		
		
		const statusCode = 200;

		res.setHeader('Content-Type', 'application/json;charset=utf8;');
		res.statusCode = statusCode;
		res.write(JSON.stringify({
			status: 'ok',
			content: message
		}));
		res.end();
		resolve({statusCode});

	} 
	else if (parsedRoute.segments[1] === 'fields') {

		const statusCode = 200;
		const fields = Message.getFields();

		res.setHeader('Content-Type', 'application/json;charset=utf8;');
		res.statusCode = statusCode;
		res.write(JSON.stringify({
			status: 'ok',
			content: fields
		}));
		res.end();
		resolve({statusCode});

	} 
	else if (parsedRoute.segments[1] === 'settings') {

		const statusCode = 200;

		res.setHeader('Content-Type', 'application/json;charset=utf8;');
		res.statusCode = statusCode;
		res.write(JSON.stringify({
			status: 'ok',
			content: {
				sort: {
					value: "date",
					dir: "asc"
				},
				limit: 10,
				skip: 0
			}
		}));
		res.end();
		resolve({statusCode});
	}
}

exports.post = function (res, { resolve, body, parsedRoute }) {
	if (!body || !body.text) {
		const statusCode = 400;
		res.statusCode = statusCode;
		res.end(JSON.stringify({
			status: 'error',
			message: 'Bad request: Message is not defined.'
		}));
		resolve({statusCode});
		return;
	}

	const message = new Message(messageService.getNextId(), body.text);

	messageService.post(message);
	const statusCode = 200;
	res.statusCode = statusCode;
	res.write(JSON.stringify({
		status: 'ok',
		content: message
	}));
	res.end();
	resolve({statusCode});
}

exports.put = function (res, { resolve, body, parsedRoute }) {
	const id = +parsedRoute.segments[1];
	const messageText = body.text;

	if ((!id && id !== 0) || isNaN(id)) {
		const statusCode = 400;
		res.statusCode = statusCode;
		res.end(JSON.stringify({
			status: 'error',
			message: 'Bad request: Id is not defined or not a number.'
		}));
		resolve({statusCode});
		return;
	}

	if (!body || !messageText) {
		const statusCode = 400;
		res.statusCode = statusCode;
		res.end(JSON.stringify({
			status: 'error',
			message: 'Bad request: Message is not defined.'
		}));
		resolve({statusCode});
		return;
	}

	const message = messageService.getById(id);

	if (!message) {
		const statusCode = 404;
		res.statusCode = statusCode;
		res.end(JSON.stringify({
			status: 'error',
			message: 'Bad request: Message not found.'
		}));
		resolve({statusCode});
		return;
	}

	const newMessage = Object.assign(new Message, message);
	newMessage.text = messageText;
	messageService.update(newMessage);

	const statusCode = 200;
	res.statusCode = statusCode;
	res.write(JSON.stringify({
		status: 'ok',
		content: newMessage
	}));
	res.end();
	resolve({statusCode});
}

exports.delete = function (res, { resolve, parsedRoute }) {
	const id = +parsedRoute.segments[1];

	if ((!id && id !== 0) || isNaN(id)) {
		const statusCode = 400;
		res.statusCode = statusCode;
		res.end(JSON.stringify({
			status: 'error',
			message: 'Bad request: Id is not defined or not a number.'
		}));
		resolve({statusCode});
		return;
	}

	const message = messageService.getById(id);

	if (!message) {
		const statusCode = 404;
		res.statusCode = statusCode;
		res.end(JSON.stringify({
			status: 'error',
			message: 'Bad request: Message not found.'
		}));
		resolve({statusCode});
		return;
	}

	messageService.delete(id);

	const statusCode = 200;
	res.statusCode = statusCode;
	res.write(JSON.stringify({
		status: 'ok', 
		message: 'Message successfully deleted.'
	}));
	res.end();
	resolve({statusCode});
}