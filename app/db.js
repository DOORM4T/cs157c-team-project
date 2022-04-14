
const { MongoClient } = require('mongodb');

const url = 'mongodb://team:nosql@localhost:28017/?authSource=admin';
const client = new MongoClient(url);

async function dbConnect(dbName, collectionName) {
    const connection = await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    return { connection, db, collection }
}

module.exports = dbConnect