const dbConnect = require("./db");

main()

async function main() {
    const { connection, collection: openflight } = await dbConnect(
        "project",
        "openflight"
    );
    console.log(":: CONNECTED TO DB ::");


    // Query 1: Create a point of interest
    console.log("Q1: INSERTING...")
    const insertResult = await openflight.insertOne({
        airport_id: "test",
        name: "Test Airport",
        city: "Test City",
        country: "Test Country",
        iata: "TST",
        lcao: "TEST",
        altitude: 7357,
        timezone: 0,
        dst: "U",
        tz: "America/Los_Angeles",
        type: "airport",
        source: "User",
        lonLat: { type: "Point", coordinates: [121.8811, 37.3352] },
    });
    console.log(insertResult)

    const findInserted = await openflight.findOne({ _id: insertResult.insertedId, airport_id: "test" })
    console.log("Found inserted value:")
    console.log(findInserted)

    // Query 2: Update a point of interest
    console.log("Q2: UPDATING...")
    const updateResult = await openflight.updateOne({ _id: findInserted._id, airport_id: "test" }, { $set: { airport_id: "test (updated)" } })
    console.log(updateResult)

    // Query 3: Update a point of interest
    console.log("Q3: DELETING...")
    const deleteResult = await openflight.deleteOne({ _id: findInserted._id, airport_id: "test (updated)" })
    console.log(deleteResult)

    // Query 4: Find by classification
    console.log("Q4: FINDING BY ClASSIFICATION...")
    const airports = openflight.find({ type: "airport" }).limit(2)
    console.log(await airports.toArray())

    // Query 5: Find by name
    console.log("Q5: FINDING BY NAME...")
    const names = openflight.find({}, { projection: { _id: 0, name: 1 } }).limit(10)
    console.log(await names.toArray())


    console.log("DONE")
    console.log(":: CLOSING DB CONNECTION ::")
    connection.close();
}
