"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.execute = execute;
exports.insertDocuments = insertDocuments;
exports.findDocuments = findDocuments;
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

var _mongodb = require("mongodb");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Execute a sequence of operations.
 * Wraps `language-common/execute`, and prepends initial state for http.
 * @example
 * execute(
 *   insertDocuments(params),
 *   findDocuments(params)
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
  var client = new _mongodb.MongoClient(uri, {
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
  delete state.client;
  return state;
}
/**
 * Inserts documents into a mongoDb collection
 * @example
 *  insertDocuments({
 *    database: 'str',
 *    collection: 'kids',
 *    documents: [1,2,3]
 *   });
 * @function
 * @param {object} params - Configuration for mongo
 * @returns {State}
 */


function insertDocuments(params) {
  return function (state) {
    var client = state.client;

    var _expandReferences = (0, _languageCommon.expandReferences)(params)(state),
        database = _expandReferences.database,
        collection = _expandReferences.collection,
        documents = _expandReferences.documents,
        callback = _expandReferences.callback;

    var db = client.db(database);
    var mCollection = db.collection(collection);
    return new Promise(function (resolve, reject) {
      mCollection.insertMany(documents, function (err, result) {
        if (err) {
          reject(err);
        } else {
          console.log("Inserted ".concat(documents.length, " documents into the collection"));
          var nextState = (0, _languageCommon.composeNextState)(state, result);
          if (callback) resolve(callback(nextState));
          resolve(nextState);
        }
      });
    });
  };
}
/**
 * Find documents in a mongoDb collection
 * @example
 *  findDocuments({
 *    database: 'str',
 *    collection: 'cases',
 *    query: {a:3}
 *   });
 * @function
 * @param {object} params - Configuration for mongo
 * @returns {State}
 */


function findDocuments(params) {
  return function (state) {
    var client = state.client;

    var _expandReferences2 = (0, _languageCommon.expandReferences)(params)(state),
        database = _expandReferences2.database,
        collection = _expandReferences2.collection,
        query = _expandReferences2.query,
        callback = _expandReferences2.callback;

    var db = client.db(database);
    var mCollection = db.collection(collection);
    return new Promise(function (resolve, reject) {
      mCollection.find(query).toArray(function (err, docs) {
        if (err) {
          reject(err);
        } else {
          console.log("Found ".concat(docs.length, " documents in the collection"));
          var nextState = (0, _languageCommon.composeNextState)(state, docs);
          if (callback) resolve(callback(nextState));
          resolve(nextState);
        }
      });
    });
  };
}
