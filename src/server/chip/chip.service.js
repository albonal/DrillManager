const Chip = require('./chip.model');

global.globalChips = {};

function findData(key,data) {
 
  if (data.includes(key)) {
    var starIndex = data.indexOf(key);
    starIndex = data.indexOf("[",starIndex);
    var endIndex= data.indexOf("]",starIndex);
    return data.substring(starIndex+1, endIndex);
  } else {
    return "";
  }
}

// Each chip will try to connect the server once every 5secs
function onClientConnection(sock) {

  sock.on('data', function (data) {
    console.log(data.toString());
    var chipInfo = data.toString();
    mac = findData("MAC",chipInfo);
    var reply = "OK ";
    if (mac == '') return;

    //Find mac in the collection
    if (globalChips[mac] != undefined) {
      chip = globalChips[mac];

      chip.sensorData = findData ("TEMPERATURE",chipInfo)
      chip.activeAt = Date.now();
      if (chipInfo.includes("BUTTON_PRESSED")) {
        // Decide what to do when the button is pressed
        reply = reply + " DURATION[10]";
        chip.switchStatus = "ON";
      }

      if (chipInfo.includes("TIMER_OFF")) {
        // Decide what to do when the button is pressed
        chip.switchStatus = "OFF";
      }     
      reply = reply + " Action:" + chip.switchStatus;
      reply = reply + " Action:POWER[" + chip.power + "]";      
      sock.write(reply);
    } else {
      //If not found, add to databse
      const docquery = Chip.findOne({ mac: mac });
      docquery
        .exec()
        .then(chip => {

          if (chip == null) {
            //New chip, mac is not on the database.
            //By default when a new one is detected, turne it off
            chip = { mac: mac, switchStatus: 'OFF', power:100 };
          }

          //Save the data on the database
          const newChip = new Chip(chip);
          newChip.save(error => {
            if (error) { return; }
            console.log('data logged in database');
          });
          chip.activeAt = Date.now();
          globalChips[mac] = chip;
          //Send the reply to the chip
          sock.write(reply);
        })
        .catch(error => {
          return;
        });
    }
  });

  sock.on('close', function () {
    console.log(`connection terminated`);
  });

  sock.on('error', function (error) {
    console.log(`error ${error}`);
  });
}


function getChips(req, res) {
  const docquery = Chip.find({});
  docquery
    .exec()
    .then(chips => {
      chips.forEach(c=> {
        if (globalChips[c.mac]!=undefined) {
          c.switchStatus=globalChips[c.mac].switchStatus;
          c.activeAt=globalChips[c.mac].activeAt;
          c.sensorData=globalChips[c.mac].sensorData;
        } else {
          const newChip = {
            mac: c.mac,
            name: c.name,
            switchStatus: "OFF",
            power: 100
          };

          globalChips[c.mac] = newChip;
          globalChips[c.mac].activeAt = Date.now();
        }
    });
      res.status(200).json(chips);
    })
    .catch(error => {
      res.status(500).send(error);
      return;
    });
}

function getChip(req, res) {
  const docquery = Chip.findOne({ mac: req.params.mac });
  docquery
    .exec()
    .then(chip => {
      res.status(201).json(chip);
    })
    .catch(error => {
      res.status(500).send(error);
      return;
    });
}

function postChip(req, res) {
  const newChip = {
    mac: req.body.mac,
    name: req.body.name,
    switchStatus: req.body.switchStatus,
    power: req.body.power
  };
  const chip = new Chip(newChip);
  chip.save(error => {
    if (checkServerError(res, error)) return;
    res.status(201).json(chip);
    globalChips[chip.mac] = newChip;
    console.log('chip created');
  });
}

function updateChip(req, res) {

  const selectedChip = {
    mac: req.params.mac,
    name: req.body.name,
    switchStatus: req.body.switchStatus,
    power: req.body.power
  };

  Chip.findOneAndUpdate({ mac: req.params.mac }, selectedChip)
    .then(chip => {
      res.status(200).json(chip);
      globalChips[chip.mac] = selectedChip;
      console.log('Chip updated successfully!');
    })
    .catch(error => {
      if (checkServerError(res, error)) return;
    });
}



function deleteChip(req, res) {
  Chip.findOneAndDelete({ mac: req.params.mac })
    .then(chip => {
      res.status(200).json(chip);
      globalChips[chip.mac] = undefined;
      console.log('Chip deleted successfully!');
    })
    .catch(error => {
      if (checkServerError(res, error)) return;
    });
}


function turnOnLED(req, res) {
  const docquery = Chip.findOne({ mac: req.body.mac });
  docquery
    .exec()
    .then(chip => {
      chip.switchStatus = "ON";
      globalChips[chip.mac].switchStatus = "ON";
      chip.save();
      res.status(201).json(chip);
    })
    .catch(error => {
      res.status(500).send(error);
      return;
    });
}

function turnOffLED(req, res) {
  const docquery = Chip.findOne({ mac: req.body.mac });
  docquery
    .exec()
    .then(chip => {
      chip.switchStatus = "OFF";
      globalChips[chip.mac].switchStatus = "OFF";
      chip.save();
      res.status(201).json(chip);
    })
    .catch(error => {
      res.status(500).send(error);
      return;
    });
}

function checkServerError(res, error) {
  if (error) {
    res.status(500).send(error);
    return error;
  }
}

module.exports = {
  onClientConnection,
  getChips,
  getChip,
  postChip,
  updateChip,
  deleteChip,
  turnOnLED,
  turnOffLED
};