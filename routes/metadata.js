async function metadata(req, res) {
  res.send({
    genres: [{ path: "riddim", displayName: "Riddim" }],
    message: "Szia, udv az appban, itt a fejleszto beszel!",
    lowerLeftLatitude: 45.877284,
    lowerLeftLongitude: 16.623735,
    upperRightLatitude: 48.5084,
    upperRightLongitude: 22.524288,
  });
}

module.exports = {
  metadata,
};
