const axios = require("axios");
const mongoose = require("mongoose");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault("Hungary/Budapest");

mongoose.connect(process.env.MONGO_URL, { useUnifiedTopology: true });

const randomStopName = () => {
  const fakeStops = [
    "EF-geciutca.mp3",
    "EF-huszaria.mp3",
    "EF-orgia.mp3",
    "EF-rakosmegyer.mp3",
    "EF-rakosvagy.mp3",
  ];

  return fakeStops[Math.floor(Math.random() * fakeStops.length)];
};

const matchSchema = mongoose.Schema({
  name: String,
  id: String,
  fileName: String,
  musicOverride: String,
});

const Match = mongoose.model("Match", matchSchema);

const futarApi = axios.create({
  baseURL: "https://go.bkk.hu/api/query/v1/ws/otp/api/where/",
  params: {
    key: "riddimfutar",
    appVersion: "1.0",
  },
});

async function nearbyVehicles(req, res) {
  try {
    const response = await futarApi.get("/vehicles-for-location.json", {
      params: {
        lat: req.query.lat,
        lon: req.query.lon,
        latSpan: 0.0091,
        lonSpan: 0.0111,
        radius: 1,
        includeReferences: "routes,trips",
      },
    });

    const { list, references } = response.data.data;
    const { routes, trips } = references;

    // vehicles without a routeId and tripId are usually out of service
    // BKK_9999 IDs are for "ASP" special services (e.g. out of service, going to garage, etc.)
    const vehicles = list.filter((vehicle) => {
      return (
        vehicle.routeId &&
        vehicle.tripId &&
        vehicle.routeId !== "BKK_9999" &&
        vehicle.vehicleRouteType !== "RAIL"
      );
    });

    let data = vehicles.map((vehicle) => {
      try {
        const { routeId, tripId, location, bearing, licensePlate, label } =
          vehicle;

        const { shortName, type, color } = routes[routeId];
        const { tripHeadsign } = trips[tripId];

        return {
          vehicle: {
            location,
            bearing,
            licensePlate,
            label,
          },
          trip: {
            shortName,
            tripHeadsign,
            type,
            color,
            tripId,
          },
        };
      } catch (e) {
        console.error(e);
        return false;
      }
    });

    // filter out false values
    data = data.filter((i) => i);

    res.send(data);
  } catch (e) {
    console.error(e);
    res.send("error!");
  }
}

async function vehicleDetails(req, res) {
  try {
    const response = await futarApi.get("/trip-details.json", {
      params: {
        tripId: req.params.id,
        includeReferences: "stops,trips,routes",
        date: dayjs().format("YYYYMMDD"),
      },
    });

    const { entry, references } = response.data.data;
    const { stopTimes, vehicle } = entry;
    const { stops, trips, routes } = references;
    const {
      routeId,
      tripId,
      stopSequence,
      stopDistancePercent,
      location,
      bearing,
    } = vehicle;
    const { shortName, type, color } = routes[routeId];
    const { tripHeadsign } = trips[tripId];

    const finalStops = await Promise.all(
      stopTimes.map(async (stopTime) => {
        const { predictedArrivalTime } = stopTime;
        const { name, lat, lon } = stops[stopTime.stopId];
        const res = await Match.findOne({ name });

        return {
          name: res ? res.name : name,
          lat,
          lon,
          fileName: res ? res.fileName : randomStopName(),
          predictedArrivalTime,
          musicOverride: res && res.musicOverride ? res.musicOverride : null,
        };
      })
    );

    const finalTrip = {
      shortName,
      tripHeadsign,
      type,
      color,
    };

    const finalVehicle = {
      stopSequence,
      stopDistancePercent,
      location,
      bearing,
    };

    res.send({ vehicle: finalVehicle, trip: finalTrip, stops: finalStops });
  } catch (e) {
    console.error(e);
    res.send("error!");
  }
}

module.exports = {
  nearbyVehicles,
  vehicleDetails,
};
