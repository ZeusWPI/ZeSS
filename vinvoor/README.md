# Vinvoor

Keeping track of scans is cool and all but you need a place to show them.
That's what this does!

## How to run (for development)

-   Install nodejs 22.2.0
-   Install yarn `npm install yarn`
-   Install dependencies `yarn install`
-   Start the frontend `yarn run dev`
-   Visit: http://localhost:5173

## How to run (for production)

-   Build the image `docker build -t vinvoor:latest .`.
-   Run the image `docker run -p 80:3000 vinvoor:latest`.
