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

    console.log(possibleFolders);

    // get index of a random folder
    const index = getRandomInt(0, possibleFolders.length);
    const result = [];
    const folder = possibleFolders[index];

    // artist, title and files with breakpoint and other metadata
    const configRaw = await storage
      .bucket(bucketName)
      .file(`${req.params.type}/${folder}/config.json`)
      .download();

    const config = JSON.parse(configRaw);
    const { artist, title, files: fileConfigs } = config;

    for (let i = 0; files.length > i; i++) {
      const { name } = files[i];
      if (
        name.includes(`${req.params.type}/${folder}`) &&
        name.substring(name.length - 3, name.length) == "wav"
      ) {
        const waveform = await storage
          .bucket(bucketName)
          .file(name.replace(".wav", ".json"))
          .download();

        const configIndex = fileConfigs.findIndex(({ name: configName }) =>
          name.includes(configName)
        );

        const { breakpoint, loopable, announceUnder } = fileConfigs[configIndex];

        result.push({
          pathURL: `https://storage.googleapis.com/riddim/${name}`,
          breakpoint,
          loopable,
          announceUnder,
          waveform: JSON.parse(waveform),
        });
      }
    }

    res.send({ artist, title, files: result });
  } catch (e) {
    console.error(e);
    res.send("error!");
  }
}

module.exports = {
  fetchMusic,
};
