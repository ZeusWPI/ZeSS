# Zeus Scan Syst(e)em

_Formerly called Vincent (I did not name it - Vincent)_

Check-in in the the kelder kelder

Scans a badge at the scanner (vinscant) which registers its serial number at the webserver (vingo).

Features:

- Supports a daily check-in, keeping track of which days you have visited the kelder.

Goals:

- Support check-in and check-out, keeping track of how many hours(, minutes(, seconds)) you have been in the kelder
- Cool stats :D

Secret goals:

- Streaks
- Data
- More Data
- Skins
- Battlepass

## Structure

- `Vinscant` -> Scanner
- `Vingo` -> Backend
- `Vinvoor` -> Frontend

## Development

### Pre-commit hooks

This project has a couple of pre-commit hooks.
Automatically run them by running `git config --local core.hooksPath .githooks/`.

### Run

- Install Docker and Docker Compose
- Run the script `./dev.sh` with optional flags:
  - `-b`: Show the output of the backend.
  - `-f`: Show the output of the frontend.
  - `-c`: Rebuilds the docker containers.
  - If both `-b` and `-f` or no flags are provided, the output of both the backend and frontend are shown.

The backend is accessible at `localhost:3000`, and the frontend at `localhost:5173`.
Both the backend and the frontend support hot module reloading (HMR).

## Production

- Install Docker
- Set the required env variables for vinvoor in `vinvoor/production.env` _before_ building (see the [README in ./vinvoor](vinvoor/README.md))
- Build the image `docker build -t zess .`
- Set the required variables in a `.env` file for the backend (see the [README in ./vingo](vingo/README.md))
- Run the image `docker run -v ${PWD}/.env:/.env zess`

The website is accessible on port 4000
