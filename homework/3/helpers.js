const p = require('path');

function parse(str) {

	// Empty array
	if ((/^\[\]$/).test(str)) {
		return [];
	}

	// Filled array
	if (/^\[.*\]$/.test(str)) {
		return str
			.slice(1, str.length - 1)
			.split(',')
			.map(str => str.replace(/\'|\"/g, ''));
	}

	// Number
	if (!isNaN(+str)) {
		return +str;
	}

	// String
	return str.replace(/\'/g, '');
}

exports.getArgs = () => {
	const raw = process.argv;

	return raw.reduce((acc, cur) => {

		if ((/^\-\-/).test(cur)) {
			const entry = cur.split('=');
			const key = entry[0].slice(2);
			let value = entry[1];

			acc[key] = parse(value);
		}
		
		return acc;

	}, {});
};

exports.EXT = () => {
	const raw = process.env.EXT;
	let ext;

	if (raw) {
		ext = parse(raw);
		return Array.isArray(ext) && ext || [];
	}

	return [];
};

exports.pathChecker = (path, filter) => {
	const parsedPath = p.parse(path);
	const parsedFilter = p.parse(filter);

	const reName = parsedFilter.name.replace(/\*/g, '.+');
	const reExt = parsedFilter.ext.replace(/\*/g, '.+');

	if (parsedFilter.ext === '' && parsedFilter.name.charAt(0) === '.') {
		return parsedPath.ext === parsedFilter.name;
	}

	const extMatches = new RegExp(`^${reExt}$`).test(parsedPath.ext);
	const nameMatches = new RegExp(`^${reName}$`).test(parsedPath.name);

	return nameMatches && extMatches;
}