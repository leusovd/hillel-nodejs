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

	getAll(options = {}) {
		const limit = (isNaN(+options.limit) ? null : +options.limit ) || 10;
		const skip = (isNaN(+options.skip) ? null : +options.skip ) || 0;
		
		let result = this.sort(options.sortValue, options.sort);
		result = result.slice(skip, (skip + limit));
		
		return result;
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

	sort(value = 'date', dir = 'asc') {
		value = value !== 'id' && value !== 'date' && value !== 'text' ? 'date' : value;
		dir = dir !== 'asc' && dir !== 'desc' ? 'asc' : dir;
		let messages = this.messages.slice();
		messages = value === 'text' ? messages.sort() : messages.sort((a, b) => (a - b));

		if (dir === 'desc') {
			messages = messages.reverse();
		}

		return messages;
	}
}

module.exports = new MessageService();