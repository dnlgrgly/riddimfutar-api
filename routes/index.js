const { Router } = require("express");
const router = new Router();

const { metadata } = require("./metadata.js");
const { fetchMusic } = require("./music.js");
const {
  nearbyVehicles,
  vehicleDetails,
  vehiclePercent,
} = require("./vehicles.js");

router.get("/metadata", metadata);

router.get("/music/:type", fetchMusic);

router.get("/vehicles", nearbyVehicles);
router.get("/vehicle/:id", vehicleDetails);
router.get("/percents/:id", vehiclePercent);

module.exports = router;
