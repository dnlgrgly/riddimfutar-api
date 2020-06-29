async function metadata(req, res) {
  res.send({
    genres: [{ path: "riddim", displayName: "Riddim" }],
    message: "Udv az appban, itt a fejleszto beszel! A tavolsagmerest kellene tesztelni, ehhez mar elesben jarmure kellene szallni. *** Jeleneg az M3-mas metro vonalan es a 2-es, 3-mas, 4-es es 6-os villamosok vonalain felujitas miatt tereles van. Kerjuk figyeld a BKK-s utastajekoztatast. ***",
    lowerLeftLatitude: 47.57564,
    lowerLeftLongitude: 18.94222,
    upperRightLatitude: 47.588130,
    upperRightLongitude: 19.07639,
  });
}

module.exports = {
  metadata,
};
