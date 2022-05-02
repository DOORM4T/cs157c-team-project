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
