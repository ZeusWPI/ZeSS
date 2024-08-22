# Vingo

The webserver that keeps track of the scans :D

Register a scan by posting `card_serial;scan_key` to the `/scans` endpoint.
`scan_key` is a pre-shared key with the scanner (vinscant) so only the scanner can register a scan.

To register a card, click the "Start registering a new card" button in the cards view, after which the server will register the next scanned card for the user that initiated the request. Only 1 user can register a card at a time.

## Environment variables

- CORS_ALLOW_ORIGINS (string) | Allowed CORS
- DEVELOPMENT (bool) | Whether the program is run in development mode
- ZAUTH_URL (string) | URL of zauth
- ZAUTH_CALLBACK_PATH (string) | Callback path after the zauth authentication (should go to the backend)
- ZAUTH_CLIENT_ID (string) | ID of the zauth client
- ZAUTH_CLIENT_SECRET (string) | Secret of the zauth client
- ZAUTH_REDIRECT_URI (string) | Redirect URI after the zauth authentication is complete in the backend (should go to the frontend)
- POSTGRES_CONNECTION_STRING (string) | Connection string for the database
