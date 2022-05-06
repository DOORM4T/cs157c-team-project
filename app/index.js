const inquirer = require("inquirer");
const dbConnect = require("./db");
const WithinDistanceOperation = require("./operations/14.withinDistance");
const DistanceBetweenOperation = require("./operations/15.distanceBetween");
const ExitApplicationOperation = require("./operations/ExitApplicationOperation");

const operations = [
  new DistanceBetweenOperation(),
  new WithinDistanceOperation(),
  new ExitApplicationOperation(),
];
const operationChoices = operations.map((op) => ({ value: op.name }));

main()
  .then(() => {
    console.info("Exited.");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

async function main() {
  const { collection: openflight, connection } = await dbConnect(
    "project",
    "openflight"
  );

  while (true) {
    const { operation } = await inquirer.prompt([
      {
        name: "operation",
        type: "list",
        message: "Select an operation",
        choices: operationChoices,
      },
    ]);

    const operationToRun = operations.find((op) => op.name === operation);

    try {
      await operationToRun.execute(openflight, connection);
    } catch (error) {
      console.error(error);
    }
    console.log("\n");
  }
}
