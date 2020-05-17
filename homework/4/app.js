const http = require('http');
const { requestHandler, setIntervalLogging } = require('./request-handler.js');

const server = http.createServer(requestHandler);
setIntervalLogging();

server.listen(3000, () => {
	console.log('Server is listening on 3000');
}); 