## What the code in this folder does

- To reach this project's 1 GB data set size requirement, we synthesize additional data, since airports-extended is only about 1.6 MB.

- Wrangles the data and exports it as a CSV, which we can import to MongoDB using `mongoimport`.

## Try it!

```bash
# With synthesized data (~1GB)
node . airports-extended.dat.txt
```

```bash
# Without synthesized data (~3MB)
node . airports-extended.dat.txt no-synth
```

- This will output the processed data to `out/<timestamp>/processed.json`
- It will also log the estimated size of the processed data (~1.16 GB)

## Import processed data to MongoDB

```bash
# After starting the cluster...
# In the project root:
./import-to-cluster.sh <path-to-data>.json
```

## Resources

- airports-extended.dat.txt from https://openflights.org/data.html#airport:%5Boriginal%5D
