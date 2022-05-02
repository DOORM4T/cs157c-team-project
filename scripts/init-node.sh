#!/bin/bash

# Usage: 
#   "init-node.sh <NODE_ID>"
#   e.g. "init-node.sh 1" performs setup for node_1

# Description: 
#   Sets up a node with...
#   - config server replica set across the 3 nodes
#   - mongos (Applies to node_1 ONLY)
#   - shards a, b, c replicated across the 3 nodes

# Reference
#   - https://stackoverflow.com/questions/55916275/docker-compose-to-create-replication-in-mongodb
#   - https://www.mongodb.com/docs/manual/tutorial/deploy-shard-cluster/

NODE_ID=$1

# Initialize mongods for shards a, b, c
echo "Initializing shards..."
mkdir -p "/db/a$NODE_ID" "/db/b$NODE_ID" "/db/c$NODE_ID"
mongod --shardsvr --replSet a --dbpath "/db/a$NODE_ID" --port "2610$NODE_ID" --fork --logpath "/db/a$NODE_ID/log.a$NODE_ID" --bind_ip_all
mongod --shardsvr --replSet b --dbpath "/db/b$NODE_ID" --port "2620$NODE_ID" --fork --logpath "/db/b$NODE_ID/log.b$NODE_ID" --bind_ip_all
mongod --shardsvr --replSet c --dbpath "/db/c$NODE_ID" --port "2630$NODE_ID" --fork --logpath "/db/c$NODE_ID/log.c$NODE_ID" --bind_ip_all


# Initialize config servers as a replica set across 3 nodes
mkdir -p /db/config/data

if [ $NODE_ID == "1" ]; then

### 
### START of Node 1 Setup
###


echo "Initializing config server for Node 1..."

# Initialize config server
mongod --configsvr --replSet config --dbpath /db/config/data --port 27019 --logpath /db/config/data/mongod.log --bind_ip_all --fork
  
echo "Initializing config server replica set..."

# Initialize the config server replica set across the 3 nodes
mongosh --port 27019 << EOF
  rs.initiate(
    {
      _id : "config",
      configsvr: true,
      members: [
        { _id : 0, host : "node_1:27019" },
        { _id : 1, host : "node_2:27019" },
        { _id : 2, host : "node_3:27019" }
      ]
    }
  );
EOF

echo "Initializing mongos..."
mongos --configdb config/node_1:27019,node_2:27019,node_3:27019 --bind_ip_all --fork --logpath /db/mongos.log --port 27020

# Initialize the replica sets for shards a, b, c
echo "Creating shard a replica set"
mongosh --port 26101 << EOF
rs.initiate(
  {
    _id : "a",
    members: [
      { _id : 0, host : "node_1:26101" },
      { _id : 1, host : "node_2:26102" },
      { _id : 2, host : "node_3:26103" }
    ]
  }
);
EOF

echo "Creating shard b replica set"
mongosh --port 26201 << EOF
  rs.initiate(
    {
      _id : "b",
      members: [
        { _id : 0, host : "node_1:26201" },
        { _id : 1, host : "node_2:26202" },
        { _id : 2, host : "node_3:26203" }
      ]
    }
  );
EOF

echo "Creating shard c replica set"
mongosh --port 26301 << EOF
  rs.initiate(
    {
      _id : "c",
      members: [
        { _id : 0, host : "node_1:26301" },
        { _id : 1, host : "node_2:26302" },
        { _id : 2, host : "node_3:26303" }
      ]
    }
  );
EOF

# Connect the shards to the mongos instance
mongosh --port 27020 << EOF
  sh.addShard( "a/node_1:26101,node_2:26102,node_3:26103");
  sh.addShard( "b/node_1:26201,node_2:26202,node_3:26203");
  sh.addShard( "c/node_1:26301,node_2:26302,node_3:26303");
EOF

# Enable sharding
# Ranged shard key on country field
echo "Creating ranged shard key..."
mongosh --port 27020 << EOF
  sh.enableSharding("project");
  sh.shardCollection("project.openflight", { country : 1 } );
EOF

# Create 2dsphere index on lonLat field (so we can use GeoJSON queries)
echo "Creating index on lonLat..."
mongosh --port 27020 << EOF
  use openflight;
  db.openflight.createIndex({lonLat:"2dsphere"});
EOF

echo "Successfully configured Node $NODE_ID"

# Keep the Docker container open
tail -f /dev/null


### 
### END OF Node 1 Setup
###

else

###
### START of Node 2 & 3 setup
###

# Initialize config server
echo "Initializing config server for Node $NODE_ID"
mongod --configsvr --replSet config --dbpath /db/config/data --port 27019 --logpath /db/config/data/mongod.log --bind_ip_all

###
### END of Node 2 & 3 setup
###

fi