#!/bin/bash
docker exec node_1 sh -c "mongosh --port 27020 << EOF
sh.status();
EOF"