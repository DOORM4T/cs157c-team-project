# cs157c-team-project

Team NoSequel (CS 157C Section 4)

![image](https://user-images.githubusercontent.com/46092255/163021238-bc3dee33-37e3-4718-9372-47f3646ba3de.png)

### Progress so far...

- Created a Node.js CLI app that prompts the user for info (sample prompts for now; no real data is being used yet)
- Saves answers to a local MongoDB Docker instance via the Node.js MongoDB driver
- Scripts to start MongoDB with sharding & replication across 3 nodes

### To-do

- Implement queries. Ensure we have 15 distinct use cases.
- Use queries in CLI app

### Try it!

1. Install the following:

- Node.js 16+ via https://nodejs.org/en/
- Docker Desktop via https://www.docker.com/get-started/

3. Clone this repo
4. cd into the repo and run `npm install`
5. Start the MongoDB Docker cluster with `./start-cluster-from-scratch.sh`
6. Run the app by navigating to /app. Run `node .`
7. To generate data for the cluster, see the README in /data

### Note on scripts

There are a few bash scripts for convenience.

Important:

```bash
# If a script doesn't work, run...
chmod +x <path-to-script>.sh

# Then run it again -- it should work.
```

For example...

```bash
# Start the MongoDB cluster from scratch (3 Nodes w/ replication and sharding across shards a,b,c)
# Note: node_1 is the primary by default and runs the mongos daemon
./start-cluster-from-scratch.sh

# Import data
# See /data/README.md for additional info
# ./import_to_cluster.sh <data>.json


# Enter a bash session for node_1
./node1-bash.sh

# Enter the mongos mongosh
./node1-mongos.sh

# Check the mongos daemon status
./node1-shard-status.sh
```
