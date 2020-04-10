const messageService = require('../services/message-service.js');

module.exports = function index() {
	return (`
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Document</title>		
			<link rel="stylesheet" href="assets/css/style.css">
		</head>
		<body>
			<h1>Messanger</h1>
			<div id="messanger" class="messanger">
				<ul class="message-list"></ul>
				<form class="form">
					<textarea class="form_textarea" name="message"></textarea>
					<p class="form_error">Message is too short</p>
					<button class="btn form_submit" type="submit">Send</button>
				</form>
			</div>

			<script src="assets/js/scripts.js"></script>
		</body>
		</html>
	`);
}