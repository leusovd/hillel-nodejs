const url = require('url');

module.exports = function routeParser(req) {
	const parsed = new URL(req.url, `http://${req.headers.host}`);	

	let segments, params;
	
	if (parsed.search) {
		segments = parsed.pathname.split('?')[0].split('/');
		params = {};
		
		parsed.searchParams.forEach((value, name) => {
			params[name] = value;
		});

	} else {
		segments = parsed.pathname.split('/');
	}
	
	const method = req.method;
	const ua = req.headers['user-agent'];
	segments.shift();

	const result = {
		segments,
		method,
		ua
	};

	if (params) {
		result.params = params;
	}

	return result;
}