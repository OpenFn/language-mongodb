'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lastReferenceValue = exports.dataValue = exports.dataPath = exports.merge = exports.each = exports.alterState = exports.sourceValue = exports.fields = exports.field = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.execute = execute;
//%*So this session needs to be abstracted. What exactly are fetch2016, fetch2015
exports.fetch2016 = fetch2016;
exports.fetch2015 = fetch2015;

var _languageCommon = require('language-common');

Object.defineProperty(exports, 'field', {
  enumerable: true,
  get: function get() {
    return _languageCommon.field;
  }
});
Object.defineProperty(exports, 'fields', {
  enumerable: true,
  get: function get() {
    return _languageCommon.fields;
  }
});
Object.defineProperty(exports, 'sourceValue', {
  enumerable: true,
  get: function get() {
    return _languageCommon.sourceValue;
  }
});
Object.defineProperty(exports, 'alterState', {
  enumerable: true,
  get: function get() {
    return _languageCommon.alterState;
  }
});
Object.defineProperty(exports, 'each', {
  enumerable: true,
  get: function get() {
    return _languageCommon.each;
  }
});
Object.defineProperty(exports, 'merge', {
  enumerable: true,
  get: function get() {
    return _languageCommon.merge;
  }
});
Object.defineProperty(exports, 'dataPath', {
  enumerable: true,
  get: function get() {
    return _languageCommon.dataPath;
  }
});
Object.defineProperty(exports, 'dataValue', {
  enumerable: true,
  get: function get() {
    return _languageCommon.dataValue;
  }
});
Object.defineProperty(exports, 'lastReferenceValue', {
  enumerable: true,
  get: function get() {
    return _languageCommon.lastReferenceValue;
  }
});

var _url = require('url');

var _base = require('base-64');

var _base2 = _interopRequireDefault(_base);

var _utf = require('utf8');

var _utf2 = _interopRequireDefault(_utf);

var _resumenMin = require('./resumen.min.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require('sync-request');
// import request from 'request';


var parser = require('xml2json');
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var Buffer = require('buffer/').Buffer; // note: the trailing slash is important!

/** @module Adaptor */

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
  for (var _len = arguments.length, operations = Array(_len), _key = 0; _key < _len; _key++) {
    operations[_key] = arguments[_key];
  }

  var initialState = {
    references: [],
    data: null
  };

  return function (state) {
    return _languageCommon.execute.apply(undefined, operations)(_extends({}, initialState, state));
  };
}

/**
 * Make a GET request and POST the response somewhere else without failing.
 */
function fetch2016(params) {

  var insertDocuments = function insertDocuments(db, jsonArray, callback) {
    // Get the documents collection
    var collection = db.collection('simce_2016_school_records');
    // Insert some documents
    collection.insertMany(jsonArray, function (err, result) {
      assert.equal(err, null);
      console.log(result.insertedCount);
      callback(result);
    });
  };

  return function (state) {
    var _expandReferences = (0, _languageCommon.expandReferences)(params)(state),
        codes = _expandReferences.codes;

    var _state$configuration = state.configuration,
        endpoint = _state$configuration.endpoint,
        salt = _state$configuration.salt,
        mongoConnectionUrl = _state$configuration.mongoConnectionUrl;


    var baseUrl = "http://www.simce.cl";
	//*% Remove this

    var schools = [];
	//*% Remove this

    codes.forEach(function (code) {
      // var code = element;
      //*% Modify this 'ficha'- which is clearly specific to Chile. 
	  var secretEndpoint = endpoint + "ficha-" + code + "_" + (0, _resumenMin.resumen)(salt + _base2.default.encode("ficha-" + code + ".json")) + ".json";
      var url = (0, _url.resolve)(baseUrl + '/', secretEndpoint);
      console.log("Performing a GET on URL: " + url);

      try {
        var res = request('GET', url);
        var jsonBody = JSON.parse(res.getBody().toString('utf8'));
        console.log("Successfully fetched RBD " + code);
        //*% Remove the mention of schools below. What should replace it? 
		schools.push(jsonBody);
        console.log(JSON.stringify(jsonBody, null, 2));
      } catch (e) {
        console.log("Failed to fetch RBD " + code);
      }
    });

    // Connection URL
    var url = mongoConnectionUrl;

    // Use connect method to connect to the server
    MongoClient.connect(url, {
      // server: {
      // socketOptions: {
      connectTimeoutMS: 360000,
      socketTimeoutMS: 360000
      // }
      // }
    }, function (err, db) {
      assert.equal(null, err);
      console.log("Connected successfully to server");

      insertDocuments(db, schools, function () {
        db.close();
      });
    });
  };
};

/**
 * Make a GET request and POST the response somewhere else without failing.
 */
//*% fetch2015 needs to be replaced. But by what?
 function fetch2015(params) {

  var insertDocuments = function insertDocuments(db, jsonArray, callback) {
    // Get the documents collection
    var collection = db.collection('simce_2015_school_records');
    // Insert some documents
    collection.insertMany(jsonArray, function (err, result) {
      assert.equal(err, null);
      console.log(result.insertedCount);
      callback(result);
    });
  };

  return function (state) {
    var _expandReferences2 = (0, _languageCommon.expandReferences)(params)(state),
        codes = _expandReferences2.codes;

    var _state$configuration2 = state.configuration,
        endpoint = _state$configuration2.endpoint,
        salt = _state$configuration2.salt,
        mongoConnectionUrl = _state$configuration2.mongoConnectionUrl;


    var baseUrl = "http://www.simce.cl";

    var schools = [];

    codes.forEach(function (code) {
      // var code = element;
      var secretEndpoint = endpoint + "ficha_est-" + code + "_" + (0, _resumenMin.resumen)(salt + _base2.default.encode("ficha-" + code + ".xml")) + ".xml";
      var url = (0, _url.resolve)(baseUrl + '/', secretEndpoint);
      console.log("Performing a GET on URL: " + url);

      try {
        var res = request('GET', url);
        var jsonBody = JSON.parse(parser.toJson(res.getBody()));
        console.log("Successfully fetched RBD " + code);
        schools.push(jsonBody.establecimientos.estab);
        console.log(jsonBody);
      } catch (e) {
        console.log("Failed to fetch RBD " + code);
      }
    });

    // Connection URL
    var url = mongoUrl;

    // Use connect method to connect to the server
    MongoClient.connect(url, {
      // server: {
      // socketOptions: {
      connectTimeoutMS: 360000,
      socketTimeoutMS: 360000
      // }
      // }
    }, function (err, db) {
      assert.equal(null, err);
      console.log("Connected successfully to server");

      insertDocuments(db, schools, function () {
        db.close();
      });
    });
  };
};
