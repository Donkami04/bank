const serverless = require('serverless-http');
const app = require('./src/app');

// Wrap Express with serverless-http
module.exports.handler = serverless(app);
