# Vingo

The webserver that keeps track of the scans :D

Register a scan by posting `card_serial;scan_key` to the `/scans` endpoint.
`scan_key` is a pre-shared key with the scanner (vinscant) so only the scanner can register a scan.

To register a card, click the "Start registering a new card" button in the cards view, after which the server will register the next scanned card for the user that initiated the request. Only 1 user can register a card at a time.

## How to run (for development)

- install go
- install docker
- `docker run --name zess-postgres -e POSTGRES_PASSWORD=zess -d -p 5432:5432 postgres`
- `go run .` with the appropriate env vars set (see dev.env)
- profit

## Environment variables

- CORS_ALLOW_ORIGINS | Allowed CORS
- ZAUTH_URL | URL of zauth
- ZAUTH_CALLBACK_PATH | Callback path after the zauth authentication (should go to the backend)
- ZAUTH_CLIENT_ID | ID of the zauth client
- ZAUTH_CLIENT_SECRET | Secret of the zauth client
- ZAUTH_REDIRECT_URI | Redirect URI after the zauth authentication is complete in the backend (should go to the frontend)
- POSTGRES_CONNECTION_STRING | Connection string for the database
