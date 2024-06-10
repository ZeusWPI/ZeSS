# Zeus Scan Syst(e)em

_Formerly called Vincent_

Check-in in the the kelder kelder

(Will) scan a badge at the scanner (vinscant) which registers its serial number at the webserver (vingo).

Goals:

- Support a check-in a day, keeping track of which days you have visited the kelder
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

## How to run (for development)

### Easy & Quick

- Install Docker and Docker Compose
- Run the script `./dev.sh` with optional flags:
  - `-b`: Show the output of the backend.
  - `-f`: Show the output of the frontend.
  - If both flags or no flags are provided, the output of both the backend and frontend are shown.

The backend is accessible at `localhost:3000`, and the frontend at `localhost:5173`.

### Manual

- Each part has it's own `README.md` with instructions on how to run.
