const prompt = require('./prompt')
const handleAnswers = require('./handleAnswers')

prompt().then(handleAnswers).catch((error) => {
    console.error(error)
    console.info("An unexpected error occurred. Exiting the program.")
    process.exit(1)
})