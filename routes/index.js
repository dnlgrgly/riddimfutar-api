const { Router } = require("express");
const router = new Router();

const { metadata } = require("./metadata.js");
const { fetchMusic } = require("./music.js");
const { nearbyVehicles, vehicleDetails } = require("./vehicles.js");

router.get("/metadata", metadata);

router.get("/music/:type", fetchMusic);

router.get("/vehicle", vehicleDetails);
router.get("/vehicles", nearbyVehicles);

module.exports = router;
