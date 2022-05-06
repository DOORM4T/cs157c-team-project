const dbConnect = require("../../db");

main();

async function main() {
  const { connection, collection: openflight } = await dbConnect(
    "project",
    "openflight"
  );
  console.log(":: CONNECTED TO DB ::");

  const types = await openflight.distinct("type");
  console.log(types);

  const cities = await openflight.distinct("city");
  console.log(cities);

  const countries = await openflight.distinct("country");
  console.log(countries);

  const timezones = await openflight.distinct("tz");
  console.log(timezones);

  const sources = await openflight.distinct("source");
  console.log(sources);

  const iataCodes = await openflight.distinct("iata");
  console.log(iataCodes);

  const icaoCodes = await openflight.distinct("icao");
  console.log(icaoCodes);

  const dstCodes = await openflight.distinct("dst");
  console.log(dstCodes);

  console.log("DONE");
  console.log(":: CLOSING DB CONNECTION ::");
  connection.close();
}
