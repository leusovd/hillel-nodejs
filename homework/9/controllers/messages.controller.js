const messagesService = require('../services/messages.service.js');
const Message = require('../models/message.model.js');

exports.getAll = (req, res, next) => {
	const { sort, sortValue, limit, skip } = req.query;
	const messages = messagesService.getAll({ sort, sortValue, limit, skip });

	res.status(200).json({ status: 'ok', content: messages });
}

exports.getById = (req, res, next) => {
	const message = req.message;
	res.status(200).json({ status: 'ok', content: message });
}

exports.getFields = (req, res, next) => {
	const fields = Message.getFields();
	res.status(200).json({ status: 'ok', content: fields });
}

exports.getSettings = (req, res, next) => {
	const settings = messagesService.getSettings();
	res.status(200).json({ status: 'ok', content: settings });
}

exports.createMessage = (req, res, next) => {
	const { sender, text } = req.body;

	const message = new Message(messagesService.getNextId(), sender, text);
	messagesService.post(message);
	
	res.status(200).json({ status: 'ok', content: message });
}

exports.updateMessage = (req, res, next) => {
	const { id } = req.params;
	const { text } = req.body;

	const oldMessage = req.message;

	const newMessage = new Message(id, oldMessage.sender, text);
	messagesService.update(newMessage);

	res.status(200).json({ status: 'ok', content: newMessage });
}

exports.deleteMessage = (req, res, next) => {
	const { id } = req.params;

	messagesService.delete(id);

	res.status(200).json({ status: 'ok', message: 'Message has been successfully deleted.' });
}