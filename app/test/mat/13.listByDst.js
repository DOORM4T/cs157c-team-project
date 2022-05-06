const dbConnect = require("../../db");

main();

async function main() {
  const { connection, collection: openflight } = await dbConnect(
    "project",
    "openflight"
  );
  console.log(":: CONNECTED TO DB ::");

  // #13 QUERY LOGIC
  // Will generalize the query for the final app
  // Meaning of DST = Daylight Savings Time Country Code
  //    (E (Europe), A (US/Canada), S (South America), O (Australia),
  //    Z (New Zealand), N (None) or U (Unknown))
  // Will ask for...
  //   1. DST field
  //   2. Allow user to traverse the cursor results, filtered by DST (e.g. 10 results at a time)
  //        Results will contain only the name and airport_id

  const dstFilter = "A";
  const cursorLimit = 10;

  const cursor = openflight
    .find({ dst: dstFilter })
    .project({ _id: 0, name: 1, airport_id: 1 });

  const results = [];
  for (let i = 0; i < cursorLimit; i++) {
    if (await cursor.hasNext()) {
      const result = await cursor.next();
      results.push(result);
    }
  }

  console.log(`First 10 cursor results for DST=${dstFilter}:`);
  console.table(results);

  console.log("DONE");
  console.log(":: CLOSING DB CONNECTION ::");
  connection.close();
}
