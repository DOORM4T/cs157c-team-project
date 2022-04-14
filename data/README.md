## What the code in this folder does

- To reach this project's 1 GB data set size requirement, we synthesize additional data, since airports-extended is only about 1.6 MB. 
 
- Wrangles the data and exports it as a CSV, which we can import to MongoDB using ``mongoimport``.


## Try it!

```bash
node . airports-extended.dat.txt
```
- This will output the processed data to ``out/<timestamp>.csv``
- It will also log the estimated size of the processed data

## Resources
- airports-extended.dat.txt from https://openflights.org/data.html#airport:%5Boriginal%5D
