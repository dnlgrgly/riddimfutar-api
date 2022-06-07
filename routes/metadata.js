async function metadata(req, res) {
  res.send({
    genres: [{ path: "riddim", displayName: "Riddim" }],
    message: "Udv az appban! *** RIDDIM producer vagy? Lehet hogy pont teged keresunk. Reszletek Facebookon: fb.me/riddimfutarapp ***",
    lowerLeftLatitude: 47.170852,
    lowerLeftLongitude: 18.878917,
    upperRightLatitude: 47.665298,
    upperRightLongitude: 19.360043,
  });
}

module.exports = {
  metadata,
};
