class Message {
	constructor(dataObj) {
		this.dataObj = dataObj;
		this.id = dataObj.id;
		this.text = dataObj.text;
		this.date = new Date(dataObj.dateCreated).toISOString();

		this.$root = null;
		this.$editBtn = null;
		this.$deleteBtn = null;
	}

	getView() {
		return (`
			<li class="message-list_item message-field" data-id="${this.id}" data-mode="default">
				<span class="message-field_time">${this.date}</span>
				<div class="message-field_">
					<p class="message-field_p">${this.text}</p>
					<textarea class="message-field_textarea"></textarea>
				</div>
				<div class="message-field_controls">
					<button class="btn message-field_save">Save</button>
					<button class="btn message-field_edit">Edit</button>
					<button class="btn message-field_delete">Delete</button>
				</div>
			</li>
		`);
	}

	render($container) {
		$container.insertAdjacentHTML('beforeend', this.getView());

		this.getFields($container);
		
		this.$editBtn.addEventListener('click', e => {
			e.preventDefault();

			this.$root.dataset.mode = 'edit';
			this.$textarea.value = this.$p.textContent;
		});

		this.$saveBtn.addEventListener('click', e => {
			e.preventDefault();

			const editEvent = new CustomEvent('editMessage', { detail: {
				id: this.id,
				text: this.$textarea.value
			} });
			this.$root.dispatchEvent(editEvent);

			this.$root.dataset.mode = 'default';
		});

		this.$deleteBtn.addEventListener('click', e => {
			e.preventDefault();

			const deleteEvent = new CustomEvent('deleteMessage', { detail: { id: this.id } });
			this.$root.dispatchEvent(deleteEvent);
		});
	}

	getFields($container) {
		this.$root = $container.querySelector(`[data-id="${this.id}"]`);
		this.$p = this.$root.querySelector('.message-field_p');
		this.$textarea = this.$root.querySelector('.message-field_textarea');
		this.$editBtn = this.$root.querySelector('.message-field_edit');
		this.$saveBtn = this.$root.querySelector('.message-field_save');
		this.$deleteBtn = this.$root.querySelector('.message-field_delete');
	}

	setText(text) {
		this.$p.innerText = text;
	}
}

class Messanger {
	constructor() {
		this.$root = document.getElementById('messanger');
		this.$textarea = this.$root.querySelector('.form_textarea');
		this.$sendBtn = this.$root.querySelector('.form_submit');
		this.$messageListField = this.$root.querySelector('.message-list');
		this.$errorField = this.$root.querySelector('.form_error');
		
		this.messages = [];
		this.url = 'http://localhost:3000/messages';

		this.init();
	}

	init() {
		this.getMessages();
		this.addListeners();
	}

	addListeners() {
		this.$sendBtn.addEventListener('click', e => {
			e.preventDefault();

			const text = this.$textarea.value;

			if (text.length < 5) {
				this.$errorField.style.display = 'block';
				return;
			}

			this.sendMessage(text);
			this.$errorField.style.display = 'none';
		});
	}

	getMessages() {
		fetch(this.url)
			.then(res => res.json())
			.then(data => {
				data.forEach(item => {
					this.addNewMessage(item);
				});
			})
			.catch(err => {
				console.error(err);
			});
	}

	sendMessage(text) {
		fetch(this.url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf8'
			},
			body: JSON.stringify({text})
		}).then(res => {
			return res.json();
		}).then(data => {
			this.addNewMessage(data);
			this.$textarea.value = '';
		}).catch(err => {
			console.error(err);
		});
	}

	addNewMessage(messageObj) {
		const message = new Message(messageObj);
		this.messages.push(message);
		message.render(this.$messageListField);

		message.$root.addEventListener('deleteMessage', e => {
			this.deleteMessage(e.detail.id);
		});

		message.$root.addEventListener('editMessage', e => {
			this.editMessage(e.detail.id, e.detail.text);
		});
	}

	deleteMessage(id) {
		fetch(this.url + `/${id}`, {
			method: 'delete'
		}).then(res => res.json())
		.then(data => {
			if (data.status === 'ok') {
				const deletedMessageIndex = this.messages.findIndex(message => message.id === id);
				this.$messageListField.querySelector(`[data-id="${id}"]`).remove();
				this.messages = [
					...this.messages.slice(0, deletedMessageIndex),
					...this.messages.slice(deletedMessageIndex + 1)
				];
			}
		})
		.catch(err => {
			console.error(err.message);
		});
	}

	editMessage(id, text) {
		fetch(this.url + `/${id}`, {
			method: 'put',
			body: JSON.stringify({ text })
		}).then(res => res.json())
		.then(content => {
			if (content.status === 'ok') {
				console.log(this.messages);
				const message = this.messages.find(message => message.id === id);
				message.setText(content.data.text);
			}
		})
		.catch(err => {
			console.error(err.message);
		});
	}
}

const messanger = new Messanger();