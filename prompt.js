const inquirer = require('inquirer');

async function prompt() {
    const answers = await inquirer.prompt([
        { name: "operation", type: "list", message: "Select an operation", choices: "abcd".split("").map((val) => ({ value: `Operation ${val}` })) },
        { name: "airport", type: "list", message: "Pick an airport", choices: "abcd".split("").map((val) => ({ value: `Airport ${val}` })) },
        {
            name: "minRange", type: "input", message: "Minimum range (in miles)", validate: (input) => {
                const min = Number(input)
                if (isNaN(min)) {
                    return "Minimum range must be a number"
                }

                if (min <= 0) {
                    return "Minimum range must be greater than 0"
                }

                return true;
            }
        },
        {
            name: "maxRange", type: "input", message: "Maximum range (in miles)", validate: (input, answers) => {
                const max = Number(input)
                if (isNaN(max)) {
                    return "Maximum range must be a number"
                }

                if (max <= 0) {
                    return "Maximum range must be greater than 0"
                }

                const min = Number(answers["minRange"])
                if (min >= max) {
                    return `Maximum range must be greater than minRange (current min: ${min}, current invalid max: ${max})`
                }

                return true
            }
        },
    ])

    return answers
}


module.exports = prompt