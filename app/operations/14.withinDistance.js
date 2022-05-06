const Operation = require("./Operation");
const { Collection, MongoClient } = require("mongodb");
const { getDistance } = require("geolib");
const inquirer = require("inquirer");
const browseCursor = require("./helpers/browseCursor");

class WithinDistanceOperation extends Operation {
  name = "Within Range of POI";

  /**
   * @param {Collection} openflight
   * @param {MongoClient} connection
   */
  async execute(openflight, connection) {
    const { id, range } = await inquirer.prompt([
      {
        name: "id",
        type: "input",
        message: "Point of Interest ID",
      },
      {
        name: "range",
        type: "number",
        message: "Range Distance (meters)",
      },
    ]);

    const poi = await openflight.findOne(
      { airport_id: id },
      { _id: 0, name: 1, lonLat: 1 }
    );

    if (!poi || !poi.lonLat) throw new Error(`Invalid POI (airport_id=${id})`);

    if (isNaN(range) || range < 0)
      throw new Error(`Invalid range (range=${range})`);

    const cursor = openflight
      .find({
        lonLat: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: poi.lonLat.coordinates,
            },
            $maxDistance: range,
          },
        },
      })
      .project({ _id: 0, airport_id: 1, name: 1, lonLat: 1 });

    const resultsTitle = `POI's within ${range} meters of ${poi.name} (airport_id=${id})`;
    console.info(resultsTitle);

    await browseCursor(cursor, (result) => {
      const { airport_id, name, lonLat } = result;
      const distance = getDistance(poi.lonLat.coordinates, lonLat.coordinates);
      return { airport_id, name, "distance (meters)": distance };
    });
  }
}

module.exports = WithinDistanceOperation;
