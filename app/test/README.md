Not actual unit tests.

Just a sandbox for testing queries each team member will implement.

## Create a "Test" Query

```javascript
// COPY THIS CODE TO A NEW FILE IN YOUR FOLDER -- <your-name>/<filename>.js
// For example, mat/withinRadius.js
const dbConnect = require("../../db");

main();

async function main() {
  const { connection, collection: openflight } = await dbConnect(
    "project",
    "openflight"
  );
  console.log(":: CONNECTED TO DB ::");

  // Custom logic using openflight collection...
  // Syntax is similar to mongosh

  // Quick reference for the MongoDB node.js driver:
  //    https://www.mongodb.com/docs/drivers/node/current/quick-reference/

  console.log("DONE");
  console.log(":: CLOSING DB CONNECTION ::");
  connection.close();
}
```
