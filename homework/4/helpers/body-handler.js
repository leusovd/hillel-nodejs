module.exports = function (request, cb) {
	let body = '';

	request.on('data', chunk => {
		body += chunk.toString();
	});

	request.on('end', () => {
		if (body) {
			cb(JSON.parse(body));
		} else {
			cb('');
		}
	});
}