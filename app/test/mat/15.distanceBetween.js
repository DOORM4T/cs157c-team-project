const { getDistance } = require("geolib");
const dbConnect = require("../../db");

main();

async function main() {
  const { connection, collection: openflight } = await dbConnect(
    "project",
    "openflight"
  );
  console.log(":: CONNECTED TO DB ::");

  // #15 QUERY LOGIC
  // Will generalize the query for the final app
  //    Will ask for...
  //        1. The first POI by ID
  //        2. The second POI by ID
  //    Results:
  //        - Distance (meters) between the two POI's
  //        - Lat/long and name of the POI's

  // Just grab 2 airports for testing purposes
  const pointsOfInterest = await openflight
    .find({})
    .project({ airport_id: 1, name: 1, lonLat: 1 })
    .skip(0)
    .limit(2)
    .toArray();

  if (pointsOfInterest.length !== 2)
    throw new Error("Invalid results -- expected 2 POI's");

  console.log(pointsOfInterest);

  const [first, second] = pointsOfInterest;
  const distanceBetween = getDistance(
    first.lonLat.coordinates,
    second.lonLat.coordinates
  );

  const resultStr = `Distance between ${first.name} (id: ${first.airport_id}) and ${second.name} (id: ${second.airport_id})`;
  console.log(resultStr);
  console.log(`${distanceBetween} meters`);

  console.log("DONE");
  console.log(":: CLOSING DB CONNECTION ::");
  connection.close();
}
