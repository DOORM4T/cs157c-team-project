const Operation = require("./Operation");
const { Collection, MongoClient } = require("mongodb");
const inquirer = require("inquirer");
const browseCursor = require("./helpers/browseCursor");

class ListByPoiType extends Operation {
  name = "List by POI Type";

  /**
   * @param {Collection} openflight
   * @param {MongoClient} connection
   */
  async execute(openflight, connection) {
    const types = await openflight.distinct("type");

    const { type } = await inquirer.prompt([
      {
        name: "type",
        type: "list",
        choices: types,
        message: "Type",
      },
    ]);

    const cursor = openflight.find(
      { type },
      { projection: { _id: 0, airport_id: 1, name: 1 } }
    );
    await browseCursor(cursor);
  }
}

module.exports = ListByPoiType;
