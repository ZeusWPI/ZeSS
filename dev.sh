#!/usr/bin/env bash

# Current user
export CURRENT_UID=$(id -u):$(id -g)

# Parse input

backend=false
frontend=false
clean=false

while getopts 'bfc' flag; do
  case "${flag}" in
    b) backend=true ;;
    f) frontend=true ;;
    c) clean=true ;;
    *) echo "Unexpected option ${flag}" ;;
  esac
done

# Build the docker containers if clean flag is set

if [ "$clean" = true ]; then
    rm vingo/.env || true
    rm vinvoor/.env || true
    docker-compose -f docker-compose.yml build
fi


# Check for the required files

if [ ! -f vingo/.env ]; then
    cp vingo/dev.env vingo/.env
fi
if [ ! -f vinvoor/.env ]; then
    cp vinvoor/dev.env vinvoor/.env
fi

# Start the docker containers
docker-compose -f docker-compose.yml up -d

echo "-------------------------------------"
echo "Following logs..."
echo "Press CTRL + C to stop all containers"
echo "-------------------------------------"

if [ "$backend" = true ] && [ "$frontend" = false ]; then
    docker-compose -f docker-compose.yml logs -f zess-backend
elif [ "$backend" = false ] && [ "$frontend" = true ]; then
    docker-compose -f docker-compose.yml logs -f zess-frontend
else
    docker-compose -f docker-compose.yml logs -f zess-backend zess-frontend
fi

docker-compose -f docker-compose.yml down
