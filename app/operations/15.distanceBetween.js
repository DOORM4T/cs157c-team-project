const Operation = require("./Operation");
const { Collection, MongoClient } = require("mongodb");
const { getDistance } = require("geolib");
const inquirer = require("inquirer");

class DistanceBetweenOperation extends Operation {
  name = "Distance Between Two POI's";

  /**
   * @param {Collection} openflight
   * @param {MongoClient} connection
   */
  async execute(openflight, connection) {
    const { id1, id2 } = await inquirer.prompt([
      {
        name: "id1",
        type: "input",
        message: "First Point of Interest ID",
      },
      {
        name: "id2",
        type: "input",
        message: "Second Point of Interest ID",
      },
    ]);

    const poi1 = await openflight.findOne(
      { airport_id: id1 },
      { airport_id: 1, name: 1, lonLat: 1 }
    );

    if (!poi1)
      throw new Error(`Failed to find the first POI (airport_id=${id1})`);

    const poi2 = await openflight.findOne(
      { airport_id: id2 },
      { airport_id: 1, name: 1, lonLat: 1 }
    );

    if (!poi2)
      throw new Error(`Failed to find the second POI (airport_id=${id2})`);

    const distanceBetween = getDistance(
      poi1.lonLat.coordinates,
      poi2.lonLat.coordinates
    );

    const resultStr = `Distance between ${poi1.name} (id: ${poi1.airport_id}) and ${poi2.name} (id: ${poi2.airport_id})`;
    console.log(resultStr);
    console.log(`${distanceBetween} meters`);
  }
}

module.exports = DistanceBetweenOperation;
