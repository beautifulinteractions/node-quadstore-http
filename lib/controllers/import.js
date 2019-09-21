
'use strict';

const n3 = require('n3');
const utils = require('../utils');

const BLANK_NODE_PREFIX_REGEXP = /^[\w\d_](?:[\w\d_.]*[\w\d_])?$/;

const importController = {

  createHandler(rdfStore) {
    return utils.asyncMiddleware(async (req, res) => {

      const format = req.get('content-type');
      const blankNodePrefix = req.query['blank-node-prefix'];

      if (blankNodePrefix !== undefined 
        && blankNodePrefix !== '' 
        && blankNodePrefix.match(BLANK_NODE_PREFIX_REGEXP) === null
      ) {
        res.status(400).end('Invalid blank-node-prefix parameter.');
        return;
      }

      const parserStream = new n3.StreamParser({ 
        format, 
        blankNodePrefix,
      });

      await rdfStore.putStream(req.pipe(parserStream));
      res.status(200).end();
    });
  },

};

module.exports = importController;
