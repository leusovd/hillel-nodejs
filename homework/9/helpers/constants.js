const path = require('path');

process.env.ASSETS_PATH = path.join(process.env.ROOT_PATH, 'assets');
process.env.PORT = process.env.PORT || 3000;
process.env.SITE_URL = `http://localhost:${process.env.PORT}`;