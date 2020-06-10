const { Router } = require("express");
const router = new Router();

// const fetchMusic = require("./music.js");
const { nearbyVehicles, vehicleDetails } = require("./vehicles.js");

// router.get("/musicID", randomMusic);

router.get("/vehicle", vehicleDetails);
router.get("/vehicles", nearbyVehicles);

module.exports = router;
