class Message {
	constructor(id, sender, text) {
		this.id = id;
		this.sender = sender;
		this.text = text;
		this.dateCreated = Date.now();
	}

	static getFields() {
		return ['id', 'text', 'sender', 'date'];
	}

}

module.exports = Message;