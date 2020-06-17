const axios = require("axios");

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

    const vehicles = response.data.data.list;
    const { stops, trips, routes } = response.data.data.references;

    const data = vehicles.map((vehicle) => {
      return {
        ...vehicle,
        trip: trips[vehicle.tripId],
        stop: stops[vehicle.stopId],
        route: routes[vehicle.routeId],
      };
    });

    res.send(data);
  } catch (e) {
    console.log(e);
    res.send("error!");
  }
}

async function vehicleDetails(req, res) {
  console.log("vehicleDetails");
  console.log(req.query);

  try {
    const response = await futarApi.get("/trip-details.json", {
      params: {
        tripId: req.query.id,
        // vehicleId: req.query.id,
        includeReferences: true,
      },
    });

    res.send(response.data);
  } catch (e) {
    console.log(e);
    res.send("error!");
  }
}
module.exports = {
  nearbyVehicles,
  vehicleDetails,
};
