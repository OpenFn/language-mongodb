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
  return state;
}

/**
 * Removes connection from the state.
 * @example
 *  disconnect(state)
 * @function
 * @param {object} params - Configuration for mongo
 * @returns {State}
 */
export function insertDocuments(params) {
  return (state) => {
    const { client } = state;

    const { database, collection, documents, callback } = expandReferences(
      params
    )(state);

    const db = client.db(database);
    const mCollection = db.collection(collection);

    return new Promise((resolve, reject) => {
      mCollection.insertMany(documents, (err, result) => {
        if (err) {
          reject(err);
        } else {
          console.log(
            `Inserted ${documents.length} documents into the collection`
          );
          const nextState = composeNextState(state, result);
          if (callback) resolve(callback(nextState));
          resolve(nextState);
        }
      });
    });
  };
}

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
