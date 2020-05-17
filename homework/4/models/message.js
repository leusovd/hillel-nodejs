class Message {
	constructor(id, text) {
		this.id = id;
		this.text = text;
		this.dateCreated = Date.now();
	}

	static getFields() {
		return ['id', 'text', 'date'];
	}
}

module.exports = Message;