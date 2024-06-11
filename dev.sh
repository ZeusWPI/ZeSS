#!/bin/sh

# Parse input

backend=false
frontend=false

while getopts 'bf' flag; do
  case "${flag}" in
    b) backend=true ;;
    f) frontend=true ;;
    *) echo "Unexpected option ${flag}" ;;
  esac
done

# Check for the required files

if [ ! -f vingo/.env ]; then
    cp vingo/dev.env vingo/.env
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

docker-compose -f docker-compose.yml stop
