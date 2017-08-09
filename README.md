# language-mongodb
A language-package for interacting with a hosted MongoDB api

_N.B., most of this should be copy-pasted from language-simce, as it creates and inserts to a MongoDb instance right now but needs major abstraction and a well defined public API. (The public API are the "exported" functions like "insert" and "read").


## call notes
cd/language-packages/language-mongodb/..

this to run...
../fn-lang/lib/cli.js execute -l ./lib/Adaptor -s ./tmp/state.json -o ./tmp/output.json -e ./tmp/expression.js

cli.js execute(...) takes these arguments:
-l : language-package
-s : state is a json file. it must be a valid JSON object and have at least two keys: "data" and "configuration". These files are assembled under the hood by Elixir/ Erlang! "configuration" is the auth/connection information and data is the message that is received by OpenFn. (Not pulling data from other systems, receiving events)
-o : here's where we'll save the result.
-e : expression, that's the job that a human user writes

tmp/state.json       ... by hand!
```json
{
	"configuration": {
  	"username": "taylor",
    "connectionString": "mongodb.com/connect/217390jrosqfyud9uq68w1en213@!#21321rfwqdsqds",
    "port": 5432
  },
  "data" : {
  	"a":199,
    "surname": "Abhishek",
    "patients": [
      "doomedguy":1,
      "b":2,
      "c":3
    ]
  }
}
```

1. It's as if every time something hits the API, someone gets up and sends that fancy expression in Line 4 (in a temp directory- pulling in connection info and data).
2. Then give that data to cli.js. But that ain't enough. Need adaptor. Create in mongodb might be meaningful. So language function 'translates' into the language of the receiving application
3. Some jobs may be more complex. Might first create, then update on say...counter object. Might set field number= data value a. This would update the

state is given to cli.js in the language-package



=================================================================================================================================
### tmp/expression.js ....... example

:: Choose your adaptor! (mongodb)
```js
insert(params);
```
### example job that User mcUserFace writes
```js
insert({
  db_name: 'abhishek_test', // db_name
  collection: "testy_things", // collection
  json_data: dataValue("patients") // valid JSON to insert
});
```
### your src/adaptor.js
```js
const { db_name, collection, json_data } = expandReferences(params)(state);
const { username, connectionString, port } = state.configuration;

console.log(username) // probably need this later to send it ot Mongo



MongoClient.connect(url, {
  // server: {
    // socketOptions: {
      // Setting a Very Long ten minute timeout...
      connectTimeoutMS:1200000,
      socketTimeoutMS:1200000
    // }
  // }
}function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  insertDocuments(db, schools, function() {
    db.close();
    console.log("Yippie kay yay!");
  });
});

```
a salesforce job
```js
create("contact", fields(
	field("name", dataValue("surname"))
);

update("counter", field(
	field("number", dataValue("a")
))
```
