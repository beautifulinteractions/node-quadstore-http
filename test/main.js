
'use strict';

const utils = require('../lib/utils');
const memdown = require('memdown');
const quadstore = require('../../node-quadstore');
const SparqlEngine = require('../../node-quadstore-sparql');
const HttpServer = require('../');

describe('SparqlEngine', () => {

  beforeEach(async function () {

    const port = 8883;
    const address = '127.0.0.1';
    const baseUrl = this.baseUrl = `http://${address}:${port}`;

    this.db = memdown();
    this.store = new quadstore.RdfStore(this.db);
    this.engine = new SparqlEngine(this.store);
    this.server = new HttpServer(this.store, this.engine, {baseUrl});
    await utils.waitForEvent(this.store, 'ready');
    await new Promise((resolve, reject) => {
      this.server.listen(port, address, (err) => {
        err ? reject(err) : resolve();
      });
    });
  });

  afterEach(async function () {
    await this.store.close();
    await this.server.terminate();
  });

  require('./http')();
  require('./http.ldf')();
  require('./http.sparql')();

});
