
'use strict';

const n3 = require('n3');
const utils = require('../utils');

const importController = {

  createHandler(rdfStore) {
    return utils.asyncMiddleware(async (req, res) => {
      const parserStream = new n3.StreamParser({format: req.get('content-type')});
      await rdfStore.putStream(req.pipe(parserStream));
      res.status(200).end();
    });
  }

};

module.exports = importController;
