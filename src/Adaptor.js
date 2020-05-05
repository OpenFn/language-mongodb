/** @module Adaptor */
import {
  execute as commonExecute,
  expandReferences,
  composeNextState,
} from 'language-common';

const MongoClient = require('mongodb').MongoClient;

/**
 * Execute a sequence of operations.
 * Wraps `language-common/execute`, and prepends initial state for http.
 * @example
 * execute(
 *   create('foo'),
 *   delete('bar')
 * )(state)
 * @constructor
 * @param {Operations} operations - Operations to be performed.
 * @returns {Operation}
 */
export function execute(...operations) {
  const initialState = {
    references: [],
    data: null,
  };

  return (state) => {
    return commonExecute(
      connect,
      ...operations,
      disconnect
    )({ ...initialState, ...state });
  };
}

/**
 * Connects to a mongoDb instance
 * @example
 *  connect(state)
 * @function
 * @param {State} state - Runtime state.
 * @returns {State}
 */
function connect(state) {
  const { clusterUrl, username, password } = state.configuration;

  const uri = `mongodb+srv://${encodeURIComponent(
    username
  )}:${encodeURIComponent(
    password
  )}@${clusterUrl}/test?retryWrites=true&w=majority`;
  console.log('Connection uri: ' + uri);

  const client = new MongoClient(uri, { useNewUrlParser: true });

  return new Promise((resolve, reject) => {
    client.connect((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('Connected successfully to server');
        resolve({ ...state, client });
      }
    });
  });
}

/**
 * Removes connection from the state.
 * @example
 *  disconnect(state)
 * @function
 * @param {State} state
 * @returns {State}
 */
function disconnect(state) {
  state.client.close();
  delete state.client;
  // delete state.db;
  return state;
}

// /**
//  * Make a GET request and POST the response somewhere else without failing.
//  */
// export function fetch2016(params) {
//   var insertDocuments = function (db, jsonArray, callback) {
//     // Get the documents collection
//     var collection = db.collection('simce_2016_school_records');
//     // Insert some documents
//     collection.insertMany(jsonArray, function (err, result) {
//       assert.equal(err, null);
//       console.log(result.insertedCount);
//       callback(result);
//     });
//   };

//   return (state) => {
//     const { codes } = expandReferences(params)(state);
//     const { endpoint, salt, mongoConnectionUrl } = state.configuration;

//     const baseUrl = 'http://www.simce.cl';

//     var schools = [];

//     codes.forEach(function (code) {
//       // var code = element;
//       var secretEndpoint =
//         endpoint +
//         'ficha-' +
//         code +
//         '_' +
//         resumen(salt + base64.encode('ficha-' + code + '.json')) +
//         '.json';
//       var url = resolveUrl(baseUrl + '/', secretEndpoint);
//       console.log('Performing a GET on URL: ' + url);

//       try {
//         var res = request('GET', url);
//         const jsonBody = JSON.parse(res.getBody().toString('utf8'));
//         console.log('Successfully fetched RBD ' + code);
//         schools.push(jsonBody);
//         // console.log(JSON.stringify(jsonBody, null, 2));
//       } catch (e) {
//         console.log('Failed to fetch RBD ' + code);
//       }
//     });

//     // Connection URL
//     var url = mongoConnectionUrl;

//     // Use connect method to connect to the server
//     MongoClient.connect(
//       url,
//       {
//         // server: {
//         // socketOptions: {
//         // Setting a Very Long ten minute timeout...
//         connectTimeoutMS: 1200000,
//         socketTimeoutMS: 1200000,
//         // }
//         // }
//       },
//       function (err, db) {
//         assert.equal(null, err);
//         console.log('Connected successfully to server');

//         insertDocuments(db, schools, function () {
//           db.close();
//         });
//       }
//     );
//   };
// }

// /**
//  * Make a GET request and POST the response somewhere else without failing.
//  */
// export function fetch2015(params) {
//   var insertDocuments = function (db, jsonArray, callback) {
//     // Get the documents collection
//     var collection = db.collection('simce_2015_school_records');
//     // Insert some documents
//     collection.insertMany(jsonArray, function (err, result) {
//       assert.equal(err, null);
//       console.log(result.insertedCount);
//       callback(result);
//     });
//   };

//   return (state) => {
//     const { codes } = expandReferences(params)(state);
//     const { endpoint, salt, mongoConnectionUrl } = state.configuration;

//     const baseUrl = 'http://www.simce.cl';

//     var schools = [];

//     codes.forEach(function (code) {
//       // var code = element;
//       var secretEndpoint =
//         endpoint +
//         'ficha_est-' +
//         code +
//         '_' +
//         resumen(salt + base64.encode('ficha-' + code + '.xml')) +
//         '.xml';
//       var url = resolveUrl(baseUrl + '/', secretEndpoint);
//       console.log('Performing a GET on URL: ' + url);

//       try {
//         var res = request('GET', url);
//         const jsonBody = JSON.parse(parser.toJson(res.getBody()));
//         console.log('Successfully fetched RBD ' + code);
//         schools.push(jsonBody.establecimientos.estab);
//         console.log(jsonBody);
//       } catch (e) {
//         console.log('Failed to fetch RBD ' + code);
//       }
//     });

//     // Connection URL
//     var url = mongoUrl;

//     // Use connect method to connect to the server
//     MongoClient.connect(
//       url,
//       {
//         // server: {
//         // socketOptions: {
//         connectTimeoutMS: 360000,
//         socketTimeoutMS: 360000,
//         // }
//         // }
//       },
//       function (err, db) {
//         assert.equal(null, err);
//         console.log('Connected successfully to server');

//         insertDocuments(db, schools, function () {
//           db.close();
//         });
//       }
//     );
//   };
// }

export {
  field,
  fields,
  sourceValue,
  alterState,
  each,
  merge,
  dataPath,
  dataValue,
  lastReferenceValue,
} from 'language-common';
