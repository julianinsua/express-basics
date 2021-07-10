const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = () => {
  console.log("Attempting Connection");
  MongoClient.connect(process.env.API_URL, { useUnifiedTopology: true })
    .then((client) => {
      console.log("Connection Success");
      _db = client.db();
    })
    .catch((e) => {
      console.log("Connection failed");
      console.log(e);
      throw e;
    });
  return Promise.resolve(_db);
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database connection";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
