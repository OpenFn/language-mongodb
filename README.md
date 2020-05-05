# Language MongoDB [![Build Status](https://travis-ci.org/OpenFn/language-mongodb.svg?branch=master)](https://travis-ci.org/OpenFn/language-mongodb)

Language Pack for building expressions and operations for use with MongoDB.

## Documentation

### sample configuration

```json
{
  "configuration": {
    "username": "something",
    "password": "secret",
    "clusterUrl": "yourCluster-xxxyzzz.mongodb.net"
  },
  "data": [
    { "name": "stu", "age": 7 },
    { "name": "rory", "age": 12 },
    { "name": "santosh", "age": 21 }
  ]
}
```

### insertDocuments

```js
insertDocuments({
  database: 'yourDb',
  collection: 'yourCollection',
  documents: (state) => {
    return state.data.map((item) => {
      return { name: item.name, age: item.age };
    });
  },
  // callback: (state) => state, // optional
});
```

### findDocuments

```js
insertDocuments({
  database: 'yourDb',
  collection: 'yourCollection',
  query: (state) => {
    return { name: 'stu' };
  },
  // callback: (state) => state, // optional
});
```

[Docs](docs/index)

## Development

Clone the repo, run `npm install`.

Run tests using `npm run test` or `npm run test:watch`

Build the project using `make`.
