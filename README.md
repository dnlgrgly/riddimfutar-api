# riddimfutár-api

## Important legal stuff

**This project is not afflitiated with the Budapesti Közlekedési Központ (BKK) and the Forgalomirányítási és Utastájékoztatási Rendszer (FUTÁR) in any way. This project is solely for educational and experimental purposes.**

## What will this service do?

This Serverless API serves the Flutter application (that can be found in [this repository](https://github.com/danielgrgly/riddimfutar-ui)) with the nearby stops, the routes, the upcoming stops of the selected route, and the S3 URLs for the sound files (both the music loops and the travel information like the "The next station is Deák Ferenc tér" voice).

It has a data model that looks like this:

```json
"stops": {
    "F01234": {
        "name": "Semmelweis Klinikák M",
        "sound": "klinikak.mp3",
        "latitude": 4x.xxxx,
        "longitude": 1x.xxxx,
        "routes": ["0050","0340",..]
    }
}

"routes": {
    "5100": {
        "type": "bus",
        "sortOrder": 21,
        "name": "5"
        "direction": "Rákospalota, Kossuth utca",
        "stops": ["F01234", "F01236", ...]
    }
  }
]
```
The stop and route data are provided by the [BKK in GTFS format](https://bkk.hu/apps/gtfs/).

It has the following endpoints:
- **GET /stops?lat={lat}&lon={lon}**
    - Get the nearest 5 stations. Provide the user latitude and longitude in the URL params.
- **GET /stops/{id}**
    - Get a particular stop's data. Useful for downloading the sound signal of the stop.
- **GET /routes/{id}**
    - Get a particular route data. Useful to get the upcoming stops on the ride.
- **GET /musicID**
    - Get a random music ID that the user will hear for the next stop. The music will be downloaded from the S3 bucket, alongside it's metadata (like the artist and an album art)

## How does you start development?
If it's not set up already, install the Serverless CLI by running `npm install -g serverless`, [create an account](https://dashboard.serverless.com/), log in to the CLI (`serverless login`), and connect your sls account with an AWS account.

## About environment variables
- .envrc is used locally, automatically passed into the app via the CLI (e.g. when testing)
- `config/dev.json` and `config/prod.json` are used in the appropiate deployment environment - an example is provided for both files
  For more info about the hows and whys, refer to [this blogpost](https://adamdelong.com/serverless-environment-variables).