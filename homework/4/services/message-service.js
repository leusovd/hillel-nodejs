const Message = require('../models/message.js');

const messages = [
	new Message(0, 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum, aperiam?'),
	new Message(1, 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptas asperiores harum fuga fugit dicta aliquid.')
];

class MessageService {
	constructor() {
		this.messages = messages;
	}

	getNextId() {
		return this.messages.length;
	}

	getById(id) {
		return this.messages.find(message => parseInt(message.id) === parseInt(id));
	}

	getAll() {
		return this.messages;
	}

	post(message) {
		this.messages.push(message);
	}

	update(message) {
		const oldMessageIndex = this.messages.findIndex(item => item.id === message.id);
		this.messages = [
			...this.messages.slice(0, oldMessageIndex),
			message,
			...this.messages.slice(oldMessageIndex + 1)
		];
	}

	delete(id) {
		const oldMessageIndex = this.messages.findIndex(item => item.id === id);
		this.messages = [
			...this.messages.slice(0, oldMessageIndex),
			...this.messages.slice(oldMessageIndex + 1)
		];
	}
}

module.exports = new MessageService();