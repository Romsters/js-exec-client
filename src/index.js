const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const compression = require('compression');
const executeRoute = require('./routes/execute');
const executor = require('./executor');

const app = express();

app.use(cors());
app.use(compression());
app.use(morgan('combined'));

app.use('/', executeRoute);

app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.use((err, req, res) => {
  res.status(500).send('Internal server error');
});

executor.init();
app.listen(config.server.port);