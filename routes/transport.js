const gtfs = require("gtfs");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

gtfs
  .import({
    agencies: [
      {
        agency_key: "BKK",
        url: "https://www.bkk.hu/gtfs/budapest_gtfs.zip",
      },
    ],
  })
  .then(() => {
    console.log("Import Successful");
    return mongoose.connection.close();
  })
  .catch((err) => {
    console.error(err);
  });

async function routeDetails(req, res) {
  const data = await gtfs.getRoutes({
    agency_key: "BKK",
    route_id: req.params.id,
  });

  res.send(data);
}

async function nearbyStops(req, res) {
  const data = await gtfs.getStops({
    agency_key: "BKK",
    within: {
      lat: req.query.lat,
      lon: req.query.lon,
      radius: 5,
    },
  });

  res.send(data);
}

async function stopDetails(req, res) {
  const data = await gtfs.getStops({
    agency_key: "BKK",
    stop_id: req.params.id,
  });

  res.send(data);
}

module.exports = {
  routeDetails,
  nearbyStops,
  stopDetails,
};
