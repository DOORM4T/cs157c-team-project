const Operation = require("./Operation");
const { Collection, MongoClient } = require("mongodb");
const { getDistance } = require("geolib");
const inquirer = require("inquirer");
const browseCursor = require("./helpers/browseCursor");

class CreatePoiOperation extends Operation {
  name = "Create a Point of Interest";

  /**
   * @param {Collection} openflight
   * @param {MongoClient} connection
   */
  async execute(openflight, connection) {
    const {
      id: airport_id,
      name,
      city,
      country,
      iata,
      lcao,
      altitude,
      timezone,
      dst,
      tz,
      type,
      source,
      longitude,
      latitude,
    } = await inquirer.prompt([
      {
        name: "id",
        type: "input",
        message: "ID",
      },
      {
        name: "name",
        type: "input",
        message: "Name",
      },
      {
        name: "city",
        type: "input",
        message: "City",
      },
      {
        name: "country",
        type: "input",
        message: "Country",
      },
      {
        name: "iata",
        type: "input",
        message: "IATA Code",
      },
      {
        name: "icao",
        type: "input",
        message: "ICAO Code",
      },
      {
        name: "altitude",
        type: "input",
        message: "Altitude",
      },
      {
        name: "timezone",
        type: "input",
        message: "Timezone",
      },
      {
        name: "dst",
        type: "input",
        message: "DST",
      },
      {
        name: "tz",
        type: "input",
        message: "Tz",
      },
      {
        name: "type",
        type: "input",
        message: "Type",
      },
      {
        name: "source",
        type: "input",
        message: "Source",
      },
      {
        name: "longitude",
        type: "number",
        message: "Longitude",
      },
      {
        name: "latitude",
        type: "number",
        message: "Latitude",
      },
    ]);

    const insertResult = await openflight.insertOne({
      airport_id,
      name,
      city,
      country,
      iata,
      lcao,
      altitude,
      timezone,
      dst,
      tz,
      type,
      source,
      lonLat: { type: "Point", coordinates: [longitude, latitude] },
    });

    if (insertResult.acknowledged) {
      console.info("Success");
    } else {
      throw new Error("Failed to insert");
    }
  }
}

module.exports = CreatePoiOperation;
