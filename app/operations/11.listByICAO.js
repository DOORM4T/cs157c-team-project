const Operation = require("./Operation");
const { Collection, MongoClient } = require("mongodb");
const inquirer = require("inquirer");
const browseCursor = require("./helpers/browseCursor");

class ListByICAO extends Operation {
  name = "List by ICAO Code";

  /**
   * @param {Collection} openflight
   * @param {MongoClient} connection
   */
  async execute(openflight, connection) {
    const icaoCodes = await openflight.distinct("icao");

    const { icao } = await inquirer.prompt([
      {
        name: "icao",
        type: "list",
        choices: icaoCodes,
        message: "ICAO Code",
      },
    ]);

    const cursor = openflight.find(
      { icao },
      { projection: { _id: 0, airport_id: 1, name: 1 } }
    );
    await browseCursor(cursor);
  }
}

module.exports = ListByICAO;
