const Operation = require("./Operation");
const { Collection, MongoClient } = require("mongodb");
const inquirer = require("inquirer");
const browseCursor = require("./helpers/browseCursor");

class ListAll extends Operation {
  name = "List All";

  /**
   * @param {Collection} openflight
   * @param {MongoClient} connection
   */
  async execute(openflight, connection) {
    const cursor = openflight.find(
      {},
      {
        projection: { _id: 0, airport_id: 1, name: 1 },
      }
    );

    await browseCursor(cursor);
  }
}

module.exports = ListAll;
