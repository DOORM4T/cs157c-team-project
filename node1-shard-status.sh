#!/bin/bash
# Run sh.status() on node_1's mongos mongosh
docker exec node_1 sh -c "mongosh --port 27020 << EOF
sh.status();
EOF"