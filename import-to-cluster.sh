#!/bin/bash

# Description:
#   Import JSON to the sharded cluster via Node 1


# Usage:
# ./import_to_cluster.sh <data>.json

DATA_PATH=$1

echo "Attempting to import $1 to node_1..."

echo "Copying file..."
docker cp $DATA_PATH node_1:/home/to_import.json

echo "Importing..."
docker exec node_1 \
    mongoimport --file /home/to_import.json --jsonArray --db project --collection openflight --port 26101