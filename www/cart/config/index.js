const process = require('process');
let mode = process.argv[2];
console.log(mode)
module.exports = {
    mode,
    ...(mode == 'dev' ? require('./config.dev') : require('./config.prod'))
}