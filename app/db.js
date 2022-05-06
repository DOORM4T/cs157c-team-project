const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:30002/?directConnection=true";
const client = new MongoClient(url);

async function dbConnect(dbName, collectionName) {
  const connection = await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  return { connection, db, collection };
}

module.exports = dbConnect;
