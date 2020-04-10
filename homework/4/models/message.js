class Message {
	constructor(id, text) {
		this.id = id;
		this.text = text;
		this.dateCreated = Date.now();
	}
}

module.exports = Message;