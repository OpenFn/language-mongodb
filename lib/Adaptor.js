'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lastReferenceValue = exports.dataValue = exports.dataPath = exports.merge = exports.each = exports.alterState = exports.sourceValue = exports.fields = exports.field = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.execute = execute;
//%*So this session needs to be abstracted. What exactly are fetch2016, fetch2015
exports.fetch2016 = fetch2016;

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require('sync-request');
// import request from 'request';

var parser = require('xml2json');
var MongoClient = require('mongodb').MongoClient,
	Server= require(Server).Server;
    assert = require('assert');

var Buffer = require('buffer/').Buffer; // note: the trailing slash is important!

const { db_name, collection, json_data } = expandReferences(params)(state);
const { username, password, host, port, db_name} = state.configuration;


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
		
    codes.forEach(function (code) {
      // var code = element;
      //var secretEndpoint = endpoint + "ficha-" + code + "_" +(salt + _base2.default.encode("ficha-" + code + ".json")) + ".json";
      //var url = (0, _url.resolve)(baseUrl +, secretEndpoint);
	  var url= function(username='', password='', host='localhost', port= 27017, db_name='admin',  ){
		  return ("mongodb://"+username+":"+password+"@"+host+":"+"port"+"/"+db_name);
	  }
	  
	  
      console.log("Performing a GET on URL: " + url);

      try {
        var res = request('GET', url);
        var jsonBody = JSON.parse(res.getBody().toString('utf8'));
        console.log("Successfully fetched RBD " + code);
        //*% Remove the mention of schools below. What should replace it? Collections? But then that has to be global in scope
		collection.push(jsonBody);
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
		  //am a bit confused here regarding the use of db vs db_name. Is db here a system defined name? 
        db.close();
      });
    });
  };
};



