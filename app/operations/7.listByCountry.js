const Operation = require("./Operation");
const { Collection, MongoClient } = require("mongodb");
const inquirer = require("inquirer");
const browseCursor = require("./helpers/browseCursor");

class ListByCountry extends Operation {
  name = "List by Country";

  /**
   * @param {Collection} openflight
   * @param {MongoClient} connection
   */
  async execute(openflight, connection) {
    const countries = await openflight.distinct("country");

    const { country } = await inquirer.prompt([
      {
        name: "country",
        type: "list",
        choices: countries,
        message: "Country",
      },
    ]);

    const cursor = openflight.find(
      { country },
      { projection: { _id: 0, airport_id: 1, name: 1 } }
    );
    await browseCursor(cursor);
  }
}

module.exports = ListByCountry;
