const dbConnect = require("./db")

async function handleAnswers(answers) {
    console.log(answers)

    // TODO: Insert answers to an answers collection for testing purposes
    // TODO: Handle actual airport collection
    const { connection, collection: answersCollection } = await dbConnect("team-project", "answers")
    await answersCollection.insertOne(answers)
    const allAnswers = await answersCollection.find().toArray()
    console.log(allAnswers)

    await connection.close()
    return

    // TODO: Query 1

    // TODO: Query 2

    // TODO: Query 3

    // TODO: Query 4

    // TODO: Query 5
}

module.exports = handleAnswers