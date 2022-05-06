const Operation = require("./Operation");
const { Collection, MongoClient } = require("mongodb");
const inquirer = require("inquirer");

class DeletePoiOperation extends Operation {
  name = "Delete a Point of Interest";

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

    const result = await openflight.deleteOne({ airport_id: id });

    if (result.deletedCount > 0) {
      console.info("Success");
    } else {
      throw new Error(`Failed to delete (airport_id=${id})`);
    }
  }
}

module.exports = DeletePoiOperation;
