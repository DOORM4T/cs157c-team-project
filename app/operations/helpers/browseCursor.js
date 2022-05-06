const { FindCursor } = require("mongodb");
const inquirer = require("inquirer");

const LIMIT = 10;

/**
 *
 * @param {FindCursor} cursor
 * @param {(result:any) => any} processResult
 */
module.exports = async function browseCursor(cursor, processResult) {
  let isViewing = true;
  let offset = 0;
  while (isViewing) {
    console.info(`Page ${offset}`);
    const results = [];
    for (let i = 0; i < LIMIT; i++) {
      if (await cursor.hasNext()) {
        const result = await cursor.next();

        if (processResult) {
          results.push(processResult(result));
        } else {
          results.push(result);
        }
      }
    }

    console.table(results);

    const choices = [];

    if (await cursor.hasNext()) {
      choices.push(`Next`);
    }

    if (offset > 0) {
      choices.push(`Prev`);
    }

    choices.push("Exit");

    const { op } = await inquirer.prompt([
      {
        name: "op",
        type: "list",
        choices,
      },
    ]);

    switch (op) {
      case "Prev":
        if (offset > 0) {
          offset--;
          cursor.rewind();
          for (let i = 0; i < offset * LIMIT; i++) {
            await cursor.next();
          }
        }
        break;
      case "Next":
        offset++;
        break;
      default:
        isViewing = false;
        break;
    }
  }
};
