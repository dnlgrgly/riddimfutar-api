const { Router } = require("express");
const router = new Router();

// const fetchMusic = require("./music.js");
const { routeDetails, nearbyStops, stopDetails } = require("./transport.js");

// router.get("/musicID", randomMusic);

router.get("/routes/:id", routeDetails);

router.get("/stops", nearbyStops);
router.get("/stops/:id", stopDetails);

module.exports = router;
