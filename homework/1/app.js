require('./logger.js');
const { getArgs, getExtEnv } = require('./helpers.js');
const showFiles = require('./show-files.js');


const { path, deep } = getArgs();
const ext = getExtEnv();

showFiles(path, deep, ext);


