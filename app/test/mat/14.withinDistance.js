const dbConnect = require("../../db");

main();

async function main() {
  const { connection, collection: openflight } = await dbConnect(
    "project",
    "openflight"
  );
  console.log(":: CONNECTED TO DB ::");

  // #14 QUERY LOGIC
  // maxDistance is in meters
  // Will generalize the query for the final app
  //    Will ask for...
  //        1. An airport by ID
  //        2. Distance (meters)

  const maxDistance = 500_000;

  const withinDistance = await openflight
    .find({
      lonLat: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [-84.5093994140625, 46.48500061035156],
          },
          $maxDistance: maxDistance,
        },
      },
    })
    .limit(10)
    .toArray();

  console.log("Results:");
  console.log(withinDistance);
  console.log(`Found: ${withinDistance.length}`);

  console.log("DONE");
  console.log(":: CLOSING DB CONNECTION ::");
  connection.close();
}
