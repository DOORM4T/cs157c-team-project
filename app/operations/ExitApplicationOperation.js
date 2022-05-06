const Operation = require("./Operation");
const { Collection, MongoClient } = require("mongodb");

class ExitApplicationOperation extends Operation {
  name = "Exit Application";

  /**
   * @param {Collection} openflight
   * @param {MongoClient} connection
   */
  async execute(openflight, connection) {
    await connection.close();
    console.info("Exited.");
    process.exit(0);
  }
}

module.exports = ExitApplicationOperation;
