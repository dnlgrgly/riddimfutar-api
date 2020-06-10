const axios = require("axios");

const futarApi = axios.create({
  baseURL: "https://futar.bkk.hu/api/query/v1/ws/otp/api/where/",
  params: {
    key: "riddimfutar",
    appVersion: "1.0",
  },
});

async function nearbyVehicles(req, res) {
  const response = await futarApi.get("/vehicles-for-location.json", {
    params: {
      lat: req.query.lat,
      lon: req.query.lon,
      latSpan: 0.008747329406197935,
      lonSpan: 0.010232225997739874,
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
}

async function vehicleDetails(req, res) {
  const response = await axios.get("/trip-details.json", {
    params: {
      //   tripId: req.params.id,
      vehicleId: req.params.id,
      includeReferences: true,
    },
  });

  console.log(response);

  res.send(response.data);
}

module.exports = {
  nearbyVehicles,
  vehicleDetails,
};
