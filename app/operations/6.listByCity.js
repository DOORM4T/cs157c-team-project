const Operation = require("./Operation");
const { Collection, MongoClient } = require("mongodb");
const inquirer = require("inquirer");
const browseCursor = require("./helpers/browseCursor");

class ListByCity extends Operation {
  name = "List by City";

  /**
   * @param {Collection} openflight
   * @param {MongoClient} connection
   */
  async execute(openflight, connection) {
    const cities = await openflight.distinct("city");

    const { city } = await inquirer.prompt([
      {
        name: "city",
        type: "list",
        choices: cities,
        message: "City",
      },
    ]);

    const cursor = openflight.find(
      { city },
      { projection: { _id: 0, airport_id: 1, name: 1 } }
    );
    await browseCursor(cursor);
  }
}

module.exports = ListByCity;
