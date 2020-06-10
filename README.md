# riddimfutár-api

This is an Express API with Node.js and Google App Engine for the RIDDIMFUTÁR app.

## Important legal stuff

**This project is not afflitiated with the Budapesti Közlekedési Központ (BKK) and the Forgalomirányítási és Utastájékoztatási Rendszer (FUTÁR) in any way. This project is solely for educational and experimental purposes.**

## What will this service do?

This Express API serves the Flutter application (that can be found in [this repository](https://github.com/danielgrgly/riddimfutar-ui)) with the nearby stops, the routes, the upcoming stops of the selected route, and the URLs for the sound files (both the music loops and the local announcments, such as the "The next station is Deák Ferenc tér" recording).

The stop and route data are provided by the BKK via the [BKK FUTÁR API](https://bkkfutar.docs.apiary.io/).

Our API has the following endpoints:

### if the "Proposal A" wins

- **GET /stops?lat={lat}&lon={lon}**
  - Get nearby stations. Provide the user latitude and longitude in the URL params.
- **GET /stops/{id}**
  - Get a particular stop's data. Useful for downloading the sound signal of the stop.
- **GET /routes/{id}**
  - Get a particular route data. Useful to get the upcoming stops on the ride.
- **GET /musicID**
  - Get a random music ID that the user will hear for the next stop. The music will be downloaded from the bucket, alongside it's metadata (like the artist and an album art)

### if the "Proposal B" wins

- **GET /vehicles?lat={lat}&lon={lon}**
  - Get nearby vehicles. Provide the user latitude and longitude in the URL params.
- **GET /vehicles/{id}**
  - Get a particular vehicle's data. Useful for downloading the sound signal of the stop.
- **GET /musicID**
  - Get a random music ID that the user will hear for the next stop. The music will be downloaded from the bucket, alongside it's metadata (like the artist and an album art)

## How do you start development?

```sh
npm i
npm run dev
```

## About environment variables

- .envrc is used locally, automatically passed into the app via the CLI (e.g. when testing)
- `config/dev.json` and `config/prod.json` are used in the appropiate deployment environment - an example is provided for both files
  For more info about the hows and whys, refer to [this blogpost](https://adamdelong.com/serverless-environment-variables).
