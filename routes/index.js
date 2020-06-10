const { Router } = require("express");
const router = new Router();

// const randomMusic = require("music/random");
// const routeDetails = require("routes/details");
// const stopDetails = require("stops/details");
// const nearbyStops = require("stops/nearby");

// router.get("/musicID", randomMusic);

// router.get("/routes/:id", routeDetails);

// router.get("/stops", nearbyStops);
// router.get("/stops/:id", stopDetails);

router.get("/hi", (req, res) =>
  res.send("ayy yoo this is google app service talkin, who dis?")
);

module.exports = router;
