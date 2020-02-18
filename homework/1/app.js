const { getArgs, getExtEnv } = require('./helpers.js');
const showFiles = require('./show-files.js');

const { path, deep, colors } = getArgs();
const ext = getExtEnv();

showFiles(path, deep, colors, ext);
