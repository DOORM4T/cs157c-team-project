const dbConnect = require("./db")

async function handleAnswers(answers) {
    const { connection, collection: answersCollection } = await dbConnect("project", "openflight")

    await connection.close()
    return

    // TODO: Query 1

    // TODO: Query 2

    // TODO: Query 3

    // TODO: Query 4

    // TODO: Query 5
}

module.exports = handleAnswers