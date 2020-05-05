"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execute = execute;
Object.defineProperty(exports, "field", {
  enumerable: true,
  get: function get() {
    return _languageCommon.field;
  }
});
Object.defineProperty(exports, "fields", {
  enumerable: true,
  get: function get() {
    return _languageCommon.fields;
  }
});
Object.defineProperty(exports, "sourceValue", {
  enumerable: true,
  get: function get() {
    return _languageCommon.sourceValue;
  }
});
Object.defineProperty(exports, "alterState", {
  enumerable: true,
  get: function get() {
    return _languageCommon.alterState;
  }
});
Object.defineProperty(exports, "each", {
  enumerable: true,
  get: function get() {
    return _languageCommon.each;
  }
});
Object.defineProperty(exports, "merge", {
  enumerable: true,
  get: function get() {
    return _languageCommon.merge;
  }
});
Object.defineProperty(exports, "dataPath", {
  enumerable: true,
  get: function get() {
    return _languageCommon.dataPath;
  }
});
Object.defineProperty(exports, "dataValue", {
  enumerable: true,
  get: function get() {
    return _languageCommon.dataValue;
  }
});
Object.defineProperty(exports, "lastReferenceValue", {
  enumerable: true,
  get: function get() {
    return _languageCommon.lastReferenceValue;
  }
});

var _languageCommon = require("language-common");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var MongoClient = require('mongodb').MongoClient;
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


function execute() {
  for (var _len = arguments.length, operations = new Array(_len), _key = 0; _key < _len; _key++) {
    operations[_key] = arguments[_key];
  }

  var initialState = {
    references: [],
    data: null
  };
  return function (state) {
    return _languageCommon.execute.apply(void 0, [connect].concat(operations, [disconnect]))(_objectSpread(_objectSpread({}, initialState), state));
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
  var _state$configuration = state.configuration,
      clusterUrl = _state$configuration.clusterUrl,
      username = _state$configuration.username,
      password = _state$configuration.password;
  var uri = "mongodb+srv://".concat(encodeURIComponent(username), ":").concat(encodeURIComponent(password), "@").concat(clusterUrl, "/test?retryWrites=true&w=majority");
  console.log('Connection uri: ' + uri);
  var client = new MongoClient(uri, {
    useNewUrlParser: true
  });
  return new Promise(function (resolve, reject) {
    client.connect(function (err) {
      if (err) {
        reject(err);
      } else {
        console.log('Connected successfully to server');
        resolve(_objectSpread(_objectSpread({}, state), {}, {
          client: client
        }));
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
  delete state.client; // delete state.db;

  return state;
} // /**
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
