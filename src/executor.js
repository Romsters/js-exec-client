const amqp = require('amqplib');
const uuid = require('uuid');
const _ = require('lodash');
const config = require('./config');
const querablePromise = require('./utils/querablePromise');

module.exports = {
  async init() {
    this.requests = [];
    this.connection = await amqp.connect(`amqp://${config.rabbitMQ.host}:${config.rabbitMQ.port}`);
    this.channel = await this.connection.createChannel();
    this.q = await this.channel.assertQueue('', { exclusive: true });
    this.channel.consume(this.q.queue, this.handle.bind(this), { noAck: true });
  },
  execute(filename) {
    let qPromise;
    const promise = new Promise(resolve => {
      const correlationId = uuid.v4();
      this.channel.sendToQueue(config.requestsQueueName,
      new Buffer(filename),
      { correlationId, replyTo: this.q.queue });

      const timeout = setTimeout(() => {
        if (qPromise.isFulfilled()) {
          return;
        }
        _.remove(this.requests, request => request.id === correlationId);
        resolve('Error, timeout exceeded');
      }, config.executionTimeout);

      this.requests.push({
        id: correlationId,
        resolve,
        timeoutId: timeout
      });
    });
    qPromise = querablePromise(promise);
    return qPromise;
  },
  handle(msg) {
    const req = _.find(this.requests, request => request.id === msg.properties.correlationId);
    if (!req) {
      return;
    }
    clearTimeout(req.timeoutId);
    _.remove(this.requests, request => request.id === req.id);
    const result = msg.content.toString();
    req.resolve(result);
  }
};