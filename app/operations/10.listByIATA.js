const Operation = require("./Operation");
const { Collection, MongoClient } = require("mongodb");
const inquirer = require("inquirer");
const browseCursor = require("./helpers/browseCursor");

class ListByIATA extends Operation {
  name = "List by IATA Code";

  /**
   * @param {Collection} openflight
   * @param {MongoClient} connection
   */
  async execute(openflight, connection) {
    const iataCodes = await openflight.distinct("iata");

    const { iata } = await inquirer.prompt([
      {
        name: "iata",
        type: "list",
        choices: iataCodes,
        message: "IATA Code",
      },
    ]);

    const cursor = openflight.find(
      { iata },
      { projection: { _id: 0, airport_id: 1, name: 1 } }
    );
    await browseCursor(cursor);
  }
}

module.exports = ListByIATA;
