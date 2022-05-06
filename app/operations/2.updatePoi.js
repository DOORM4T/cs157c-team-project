const Operation = require("./Operation");
const { Collection, MongoClient } = require("mongodb");
const { getDistance } = require("geolib");
const inquirer = require("inquirer");
const browseCursor = require("./helpers/browseCursor");

class UpdatePoiOperation extends Operation {
  name = "Update a Point of Interest";

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

    const poi = await openflight.findOne(
      { airport_id: id },
      { projection: { _id: 0, airport_id: 0 } }
    );

    const options = Object.keys(poi);

    const { toUpdate } = await inquirer.prompt([
      {
        name: "toUpdate",
        type: "list",
        choices: options,
        message: "Field to update",
      },
    ]);

    let result;
    if (toUpdate === "lonLat") {
      const { lon, lat } = await inquirer.prompt([
        {
          name: "lon",
          type: "number",
          message: "Updated Longitude",
        },
        {
          name: "lat",
          type: "number",
          message: "Updated Latitude",
        },
      ]);

      result = await openflight.updateOne(
        { airport_id: id },
        { $set: { "lonLat.coordinates": [lon, lat] } }
      );
    } else {
      const { updatedValue } = await inquirer.prompt([
        {
          name: "updatedValue",
          type: "input",
          message: "Updated Value",
        },
      ]);

      result = await openflight.updateOne(
        { airport_id: id },
        { $set: { [toUpdate]: updatedValue } }
      );
    }

    if (result.modifiedCount > 0) {
      const updatedPoi = await openflight.findOne(
        { airport_id: id },
        { projection: { _id: 0 } }
      );
      console.table(updatedPoi);
      console.info("Success");
    } else {
      throw new Error("Failed to update.");
    }
  }
}

module.exports = UpdatePoiOperation;
