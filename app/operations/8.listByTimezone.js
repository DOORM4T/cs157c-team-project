const Operation = require("./Operation");
const { Collection, MongoClient } = require("mongodb");
const inquirer = require("inquirer");
const browseCursor = require("./helpers/browseCursor");

class ListByTimezone extends Operation {
  name = "List by Timezone";

  /**
   * @param {Collection} openflight
   * @param {MongoClient} connection
   */
  async execute(openflight, connection) {
    const countries = await openflight.distinct("tz");

    const { tz } = await inquirer.prompt([
      {
        name: "tz",
        type: "list",
        choices: countries,
        message: "Timezone",
      },
    ]);

    const cursor = openflight.find(
      { tz },
      { projection: { _id: 0, airport_id: 1, name: 1, tz: 1, timezone: 1 } }
    );
    await browseCursor(cursor);
  }
}

module.exports = ListByTimezone;
