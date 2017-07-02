var jwt = require('jsonwebtoken');
var config = require('../src/config');

const EXPIRATION_TIME = '30d';

const tokenBody = {
  email: 'test@test.com',
  iat: Math.floor(Date.now() / 1000)
};

const token = jwt.sign(tokenBody, config.auth.secret, {
  expiresIn: EXPIRATION_TIME
});

console.log(token);