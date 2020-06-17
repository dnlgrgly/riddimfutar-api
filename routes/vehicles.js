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

    // vehicles without a routeId are usually out of service
    const vehicles = response.data.data.list.filter(
      (vehicle) => vehicle.routeId
    );
    const { routes } = response.data.data.references;

    const data = vehicles.map((vehicle) => {
      const { routeId, location, bearing, licensePlate, label } = vehicle;
      const { shortName, description, type, color } = routes[routeId];

      return {
        routeId,
        location,
        bearing,
        licensePlate,
        label,
        shortName,
        description,
        type,
        color,
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

    res.send(response.data);
  } catch (e) {
    console.error(e);
    res.send("error!");
  }
}
module.exports = {
  nearbyVehicles,
  vehicleDetails,
};
