const inquirer = require("inquirer");
const dbConnect = require("./db");
const CreatePoiOperation = require("./operations/1.createPoi");
const WithinDistanceOperation = require("./operations/14.withinDistance");
const DistanceBetweenOperation = require("./operations/15.distanceBetween");
const UpdatePoiOperation = require("./operations/2.updatePoi");
const DeletePoiOperation = require("./operations/3.deletePoi");
const GetByPoiId = require("./operations/4.getByPoiId");
const ListByPoiType = require("./operations/5.listByPoiType");
const ListByCity = require("./operations/6.listByCity");
const ExitApplicationOperation = require("./operations/ExitApplicationOperation");

const operations = [
  new CreatePoiOperation(),
  new UpdatePoiOperation(),
  new DeletePoiOperation(),
  new GetByPoiId(),
  new ListByPoiType(),
  new ListByCity(),
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
