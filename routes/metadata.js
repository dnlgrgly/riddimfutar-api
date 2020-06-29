async function metadata(req, res) {
  res.send({
    genres: [{ path: "riddim", displayName: "Riddim" }],
    message: "Udv az appban, itt a fejleszto beszel! A tavolsagmerest kellene tesztelni, ehhez mar elesben jarmure kellene szallni. *** Jeleneg az M3-mas metro vonalan es a 2-es, 3-mas, 4-es es 6-os villamosok vonalain felujitas miatt tereles van. Kerjuk figyeld a BKK-s utastajekoztatast. ***",
    lowerLeftLatitude: 47.170852,
    lowerLeftLongitude: 18.878917,
    upperRightLatitude: 47.665298,
    upperRightLongitude: 19.360043,
  });
}

module.exports = {
  metadata,
};
