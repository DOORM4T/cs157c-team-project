#!/bin/bash
# Enter node_1's mongos via mongosh
docker exec -ti node_1 bash -c "mongosh --port 27020"