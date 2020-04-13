const messagesService = require('../services/messages.service.js');
const Message = require('../models/message.model.js');

exports.messageIdValidation = (req, res, next) => {
	const id = Number(req.params.id);

	if (isNaN(id)) {
		return res.status(400).json({ status: 'error', message: 'Bad request: Id is not a number.' });
	}

	req.params.id = id;
	next();
}

exports.messageExistsValidation = (req, res, next) => {
	const { id } = req.params;

	const message = messagesService.getById(id);

	if (!message) {
		return next({ statusCode: 404, message: 'Message not found.' });
	}

	req.message = message;
	next();
}

exports.messageUpdateBodyValidation = (req, res, next) => {
	const { text } = req.body;

	if (!text) {
		return res.status(400).json({ status: 'error', message: 'Bad request.' });
	}

	req.body = req.body;
	next();
}