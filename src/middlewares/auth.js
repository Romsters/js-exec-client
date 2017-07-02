const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
    req.user = await jwt.verify(token, config.auth.secret);
  } catch (e) {
    res.status(401).send('unauthorized');
    return;
  }
  next();
};