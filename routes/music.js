const { Storage } = require("@google-cloud/storage");

const storage = new Storage();

const bucketName = "riddim";

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

async function fetchMusic(req, res) {
  try {
    // fetch list of available file names
    let [files] = await storage
      .bucket(bucketName)
      .getFiles({ prefix: req.params.type });

    let possibleFolders = [];

    // list possible music
    for (let i = 0; files.length > i; i++) {
      const filename = files[i].name.split("/")[1];
      if (filename && !possibleFolders.includes(filename)) {
        possibleFolders.push(filename);
      }
    }

    // get index of a random folder
    const index = getRandomInt(0, possibleFolders.length - 1);
    const result = [];

    for (let i = 0; files.length > i; i++) {
      const { name } = files[i];
      if (
        name.includes(`${req.params.type}/${possibleFolders[index]}`) &&
        name.substring(name.length - 3, name.length) == "mp3"
      ) {
        const waveform = await storage
          .bucket(bucketName)
          .file(name.replace(".mp3", ".json"))
          .download();

        result.push({
          pathURL: `https://storage.googleapis.com/riddim/${name}`,
          waveform: JSON.parse(waveform),
        });
      }
    }

    const config = await storage
      .bucket(bucketName)
      .file(`${req.params.type}/${possibleFolders[index]}/config.json`)
      .download();

    res.send({ config: JSON.parse(config), files: result });
  } catch (e) {
    console.error(e);
    res.send("error!");
  }
}

module.exports = {
  fetchMusic,
};
