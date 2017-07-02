const server = require('./server');
const auth = require('./auth');
const rabbitMQ = require('./rabbitMQ');

module.exports = {
  server,
  auth,
  rabbitMQ,
  requestsQueueName: 'requests',
  executionTimeout: 2000
};