const Operation = require("./Operation");
const { Collection, MongoClient } = require("mongodb");
const inquirer = require("inquirer");
const browseCursor = require("./helpers/browseCursor");

class ListBySource extends Operation {
  name = "List by Source";

  /**
   * @param {Collection} openflight
   * @param {MongoClient} connection
   */
  async execute(openflight, connection) {
    const sources = await openflight.distinct("source");

    const { source } = await inquirer.prompt([
      {
        name: "source",
        type: "list",
        choices: sources,
        message: "Source",
      },
    ]);

    const cursor = openflight.find(
      { source },
      { projection: { _id: 0, airport_id: 1, name: 1 } }
    );
    await browseCursor(cursor);
  }
}

module.exports = ListBySource;
