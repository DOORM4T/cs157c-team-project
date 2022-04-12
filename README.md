# cs157c-team-project
Team NoSequel (CS 157C Section 4)

![image](https://user-images.githubusercontent.com/46092255/163021238-bc3dee33-37e3-4718-9372-47f3646ba3de.png)

### Progress so far...
- Created a Node.js CLI app that prompts the user for info (sample prompts for now; no real data is being used yet)
- Saves answers to a local MongoDB Docker instance via the Node.js MongoDB driver

### To-do
- Pick a data set (Suggestion: http://openflights.org/data.html#airport:%5Boriginal%5D)
  - Must be 1GB+
- Determine use cases 
- Set up 5+ queries (can test via mongosh, no need to implement in our app yet). Must have at least one of each:  
    - Create
    - Read
    - Update
    - Delete  

### Later To-dos
- Set up replication/sharding locally across 3+ nodes
- Ensure we have 15 distinct use cases


### Try it!
1. Install the following:
  - Node.js 16+ via https://nodejs.org/en/
  - Docker Desktop via https://www.docker.com/get-started/ 
3. Clone this repo
4. cd into the repo and run ``npm install``
5. Start the MongoDB Docker instance with ``docker compose up``
6. Run the app with ``node index``
