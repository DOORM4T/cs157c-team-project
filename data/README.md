## What the code in this folder does

- To reach this project's 1 GB data set size requirement, we synthesize additional data, since airports-extended is only about 1.6 MB.

- Wrangles the data and exports it as a CSV, which we can import to MongoDB using `mongoimport`.

## Try it!

```bash
node . airports-extended.dat.txt
```

- This will output the processed data to `out/<timestamp>/processed.json`
- It will also log the estimated size of the processed data (~1.7 GB)

## Import processed data to MongoDB

```bash
# After copying the processed csv file to a node running MongoDB...
mongoimport --file processed.json --jsonArray --db project --collection openflight --username team --password nosql --authenticationDatabase admin
```

## Resources

- airports-extended.dat.txt from https://openflights.org/data.html#airport:%5Boriginal%5D
