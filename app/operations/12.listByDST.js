const Operation = require("./Operation");
const { Collection, MongoClient } = require("mongodb");
const inquirer = require("inquirer");
const browseCursor = require("./helpers/browseCursor");

class ListByDST extends Operation {
  name = "List by DST (Daylight Savings Time)";

  /**
   * @param {Collection} openflight
   * @param {MongoClient} connection
   */
  async execute(openflight, connection) {
    const dstCodes = await openflight.distinct("dst");

    const { dst } = await inquirer.prompt([
      {
        name: "dst",
        type: "list",
        choices: dstCodes,
        message: "DST Code",
      },
    ]);

    const cursor = openflight.find(
      { dst },
      { projection: { _id: 0, airport_id: 1, name: 1 } }
    );
    await browseCursor(cursor);
  }
}

module.exports = ListByDST;
