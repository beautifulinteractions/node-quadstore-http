
# quadstore-sparql

`quadstore-http` exposes 
[`quadstore`](https://github.com/beautifulinteractions/node-quadstore)'s 
features via HTTP endpoints.

## Current version

Current version: **v5.0.2** [[See on NPM](https://www.npmjs.com/package/quadstore-http)].

`quadstore-http` is maintained alongside `quadstore` and versioned 
accordingly. Equal major version numbers imply compatibility between
the two modules.

## Notes

- Uses [Semantic Versioning](https://semver.org). 
  Pre-releases are tagged accordingly.
- The `master` branch is kept in sync with NPM and all development work happens
  on the `devel` branch and/or issue-specific branches.
- Requires Node.js >= 8.0.0.

## Usage

### HttpServer

The exported HttpServer class extends `http.Server` and requires instances of 
both `quadstore.RdfStore` and `quadstore-sparql`:

```
  const memdown = require('memdown');
  const quadstore = require('quadstore');
  const SparqlEngine = require('quadstore-sparql');
  const HttpServer = require('quadstore-http');

  const db = memdown();
  const rdfStore = new quadstore.RdfStore(db);
  const sparqlEngine = new SparqlEngine(rdfStore);
  const opts = {
    baseUrl: 'http://127.0.0.1:8080'
  };
  const server = new HttpServer(rdfStore, sparqlEngine, opts);

  server.listen(8080, '127.0.0.1', (err) => {
    if (err) throw err;
    console.log(`Listening!`);
  });
```

#### `GET /match`

Mirrors `RDF/JS`'s `Source.match()` method. Returns quads serialized either in 
`application/n-quads` or `application/trig` matching the specified query 
parameters. 

Supported parameters are `subject`, `predicate`, `object`, `graph`, `offset` 
and `limit`.

    GET http://127.0.0.1:8080/match?subject=<value>&offset=10&limit=10
    
Values for the `subject`, `predicate`, `object` and `graph` parameters **must**
be serialized using 
[Ruben Verborgh's `N3` library](https://www.npmjs.com/package/n3) and **must** 
be urlencoded.

#### `POST /import`

Mirrors `RDF/JS`'s `Sink.import()` method. Accepts a payload of quads serialized 
either in `application/n-quads` or `application/trig` and imports them into 
the store.

    POST http://127.0.0.1:8080/import
 
#### `POST /delete`

Mirrors `RDF/JS`'s `Store.delete()` method. Accepts a payload of quads 
serialized either in `application/n-quads` or `application/trig` and deletes 
them from the store.

    POST http://127.0.0.1:8080/delete

#### `GET /ldf`

Provides a [Linked Data Fragments](http://linkeddatafragments.org/) endpoint 
implementing the 
[Triple Pattern Fragments](https://www.hydra-cg.com/spec/latest/triple-pattern-fragments/)
(TPF) interface for use with suitable clients.

    GET http://127.0.0.1:8080/ldf?page=2
    
In order to support quads instead of triples, this endpoint is tested using 
[our own fork](https://github.com/beautifulinteractions/Client.js/tree/bi)
of the [Client.js](https://github.com/LinkedDataFragments/Client.js) library.
The fork tracks the `feature-qpf-latest` branch of the upstream repository
and merges in fixes from other branches. We will switch to the NPM version of 
Client.js (`ldf-client`) in the near future.

#### `GET,POST /sparql`

Provides a [SPARQL 1.1 Protocol](https://www.w3.org/TR/2013/REC-sparql11-protocol-20130321/)
endpoint be used with suitable clients.
