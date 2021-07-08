const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = () => {
  MongoClient.connect(process.env.API_URL)
    .then((client) => {
      console.log("Conection Success");
      _db = client.db();
    })
    .catch((e) => {
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
