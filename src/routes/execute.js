const express = require('express');
const auth = require('../middlewares/auth');
const executor = require('../executor');

const router = express.Router();

router.post('/:filename/execute', auth, async (req, res) => {
  const filename = req.params.filename;
  if (!filename) {
    res.status(400).send('filename is required');
  }
  const result = await executor.execute(filename);
  res.status(200).send({
    result
  });
});

module.exports = router;