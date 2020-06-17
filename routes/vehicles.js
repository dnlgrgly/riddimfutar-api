const axios = require("axios");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, { useUnifiedTopology: true });

const matchSchema = mongoose.Schema({
  name: String,
  id: String,
  fileName: String,
});

const Match = mongoose.model("Match", matchSchema);

const futarApi = axios.create({
  baseURL: "https://futar.bkk.hu/api/query/v1/ws/otp/api/where/",
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
        includeReferences: true,
      },
    });

    // vehicles without a routeId are usually out of service
    const vehicles = response.data.data.list.filter(
      (vehicle) => vehicle.routeId
    );
    const { routes } = response.data.data.references;

    const data = vehicles.map((vehicle) => {
      const {
        routeId,
        tripId,
        location,
        bearing,
        licensePlate,
        label,
      } = vehicle;
      const { shortName, description, type, color } = routes[routeId];

      return {
        vehicle: {
          location,
          bearing,
          licensePlate,
          label,
        },
        trip: {
          shortName,
          description,
          type,
          color,
          tripId,
        },
      };
    });

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
        tripId: req.query.id,
        // vehicleId: req.query.id,
        includeReferences: true,
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
        const { fileName } = await Match.findOne({ name });

        return {
          name,
          lat,
          lon,
          fileName,
          predictedArrivalTime,
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
