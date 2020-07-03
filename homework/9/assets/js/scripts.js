class Message {
	constructor(dataObj) {
		this.dataObj = dataObj;
		this.id = dataObj.id;
		this.text = dataObj.text;
		this.sender = dataObj.sender;
		this.date = new Date(dataObj.dateCreated).toISOString();

		this.$root = null;
		this.$editBtn = null;
		this.$deleteBtn = null;
	}

	getView() {
		return (`
			<li class="message-list_item message-field" data-id="${this.id}" data-mode="default">
				<div class="message-field_header">
					<span class="message-field_time">${this.date},</span>
					<span class="message-field_sender">${this.sender}</span>
				</div>				
				<div class="message-field_content">
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

class Settings {
	constructor() {
		this.$root = document.querySelector('.messanger_settings');
		this.$form = this.$root.querySelector('.settings_form');
		this.$trigger = document.getElementById('settings-trigger');
		this.$saveBtn = document.getElementById('settings-submit');

		// Form fields
		this.$sortValueSelect = document.getElementById('settings-sort-value');
		this.$sortDirSelect = document.getElementById('settings-sort-dir');
		this.$limit = document.getElementById('settings-limit');
		this.$skip = document.getElementById('settings-skip');
		
		this.values = {
			sort: {
				value: null,
				dir: null
			},
			limit: null,
			skip: null
		};

		this.init();
	}

	init() {
		this.getSortValues();
		this.addListeners();
	}

	getSortValues() {
		fetch('http://localhost:3000/messages/fields')
			.then(res => res.json())
			.then(data => {
				if (data.status === 'ok') {
					data.content.forEach(value => {
						const option = document.createElement('option');
						option.value = value;
						option.textContent = value;
						this.$sortValueSelect.append(option);
					});
				}
			})
			.then(() => {
				this.getDefaults();
			})
			.catch(err => {
				console.error(err.message);
			});
	}

	getDefaults() {
		fetch('http://localhost:3000/messages/settings')
			.then(res => res.json())
			.then(data => {
				if (data.status === 'ok') {
					this.values = data.content;

					this.setFieldValues();
				}
			})
			.catch(err => {
				console.error(err.message);
			});
	}

	setFieldValues() {
		this.$sortValueSelect
			.querySelector(`option[value="${this.values.sort.value}"]`)
			.setAttribute('selected', true);

		this.$sortDirSelect
			.querySelector(`option[value="${this.values.sort.dir}"]`)
			.setAttribute('selected', true);

		this.$limit.value = this.values.limit;

		this.$skip.value = this.values.skip;
	}

	addListeners() {
		this.$trigger.addEventListener('click', e => {
			e.preventDefault();

			this.$root.style.display = 'flex';
		});

		this.$saveBtn.addEventListener('click', e => {
			e.preventDefault();

			const newSettings = this.getNewSettings();
			const newSettingsIdentity = this.checkNewSettingsIdentity(newSettings);

			if (!newSettingsIdentity) {

				this.setNewSettings(newSettings);
				this.setFieldValues();
				
				const settingsChangeEvent = new CustomEvent('settingsChange', { detail: {
					values: this.values
				}});
				this.$root.dispatchEvent(settingsChangeEvent);

			}
			

			this.$root.style.display = 'none';
		});
	}

	getNewSettings() {
		const data = Object.fromEntries(new FormData(this.$form));
		return data;
	}

	setNewSettings(settings) {
		this.values = {
			sort: {
				value: settings['sort-value'],
				dir: settings['sort-dir']
			},
			limit: settings['limit'],
			skip: settings['skip']
		} 
	}

	checkNewSettingsIdentity(settings) {
		const sortValue = settings['sort-value'] === this.values.sort.value;
		const sortDir = settings['sort-dir'] === this.values.sort.dir;
		const limit = +settings['limit'] === +this.values.limit;
		const skip = +settings['skip'] === +this.values.skip;

		if (sortValue && sortDir && limit && skip) {
			return true;
		}

		return false;
	}
}

class Messanger {
	constructor() {
		this.$root = document.getElementById('messanger');
		this.$form = this.$root.querySelector('.form');
		this.$textarea = this.$root.querySelector('.form_textarea');
		this.$sendBtn = this.$root.querySelector('.form_submit');
		this.$messageListField = this.$root.querySelector('.message-list');
		this.$errorField = this.$root.querySelector('.form_error');

		this.settings = new Settings();

		this.sender = 'Sender';
		
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

			this.sendMessage(this.sender, text);
			this.$errorField.style.display = 'none';
		});

		this.settings.$root.addEventListener('settingsChange', e => {
			this.onSettingsChanged(e.detail.values);
		});
	}

	getMessages() {
		fetch(this.url)
			.then(res => res.json())
			.then(data => {
				if (data.status === 'ok') {
					data.content.forEach(item => {
						this.addNewMessage(item);
					});
				}				
			})
			.catch(err => {
				console.error(err.message);
			});
	}

	sendMessage(sender, text) {
		const data = JSON.stringify({sender, text});

		fetch(this.url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			},
			body: data
		}).then(res => {
			return res.json();
		}).then(data => {
			if (data.status === 'ok') {
				this.addNewMessage(data.content);
				this.$textarea.value = '';
			}			
		}).catch(err => {
			console.error(err.message);
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
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			},
			body: JSON.stringify({ text })
		}).then(res => res.json())
		.then(data => {
			if (data.status === 'ok') {
				const message = this.messages.find(message => message.id === id);
				message.setText(data.content.text);
			}
		})
		.catch(err => {
			console.error(err.message);
		});
	}

	onSettingsChanged(values) {
		fetch(this.url + `?sortValue=${values.sort.value}&sort=${values.sort.dir}&limit=${values.limit}&skip=${values.skip}`)
		.then(res => res.json())
		.then(data => {
			if (data.status === 'ok') {
				if (data.status === 'ok') {
					const newMessageList = document.createElement('ul');
					newMessageList.className = 'message-list';

					this.$messageListField.remove();
					this.$form.before(newMessageList);

					this.$messageListField = this.$root.querySelector('.message-list');

					data.content.forEach(item => {
						this.addNewMessage(item);
					});
				}	
			}
		})
		.catch(err => {
			console.error(err.message);
		});;
	}
}

const messanger = new Messanger();