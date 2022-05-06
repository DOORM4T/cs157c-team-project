const { Collection, MongoClient } = require("mongodb");

class Operation {
  name = "<should override in subclass>";

  /**
   * @param {Collection} openflight
   * @param {MongoClient} connection
   */
  async execute(openflight, connection) {
    throw new Error("Not implemented");
  }
}

module.exports = Operation;
