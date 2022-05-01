#!/bin/bash
echo "Initializing config server"
mkdir -p /db/config/data
mongod --configsvr --replSet config --dbpath /db/config/data --port 27019 --logpath mongod.log --bind_ip_all --fork

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

