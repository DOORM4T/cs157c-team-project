const Operation = require("./Operation");
const { Collection, MongoClient } = require("mongodb");
const inquirer = require("inquirer");

const CLASSIFICATIONS = ["Airport", "Train", "Ferry"];

class GetByPoiId extends Operation {
  name = "Get POI by ID";

  /**
   * @param {Collection} openflight
   * @param {MongoClient} connection
   */
  async execute(openflight, connection) {
    const { id } = await inquirer.prompt([
      {
        name: "id",
        type: "input",
        message: "Point of Interest ID",
      },
    ]);

    const result = await openflight.findOne(
      { airport_id: id },
      { projection: { _id: 0 } }
    );

    if (!result) throw new Error(`Failed to find POI (airport_id=${id})`);
    console.table(result);
  }
}

module.exports = GetByPoiId;
