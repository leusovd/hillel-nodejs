const express = require('express');
const app = express();
const path = require('path');
const getRequestData = require('./middleware/get-request-data.js');
const serveMedia = require('./middleware/serve-media.js');
const { setIntervalLogging } = require('./helpers/request-logger.js');
const messagesRoutes = require('./routes/messages.routes.js');


app.use(getRequestData);
app.use(serveMedia);
app.use(express.static(path.join(__dirname, 'assets')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(messagesRoutes);

app.use((err, req, res, next) => {
	res.status(err.code || 400).send({status: 'error', message: err.message});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server started on ${PORT}`);
	setIntervalLogging();
});