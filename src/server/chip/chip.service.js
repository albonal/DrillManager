const Chip = require('./chip.model');


function onClientConnection(sock) {

  sock.on('data', function (data) {
    console.log(data.toString());
    var chipInfo = data.toString();
    mac = chipInfo.substring(chipInfo.indexOf("[") + 1, chipInfo.indexOf("]"));
    var reply = "OK ";
    if (mac == undefined || mac == '') return;

    const docquery = Chip.findOne({ mac: mac });
    docquery
      .exec()
      .then(chip => {

        if (chip == null) {
          //Look for the chip on the database
          chip = { mac: mac, switchStatus: 'OFF' };
          const newChip = new Chip(chip);
          newChip.save(error => {
            if (error) { return; }
            console.log('data logged in database');
          });

          reply = reply + "Action:BLINK";
        }
      

        if (chipInfo.includes("BUTTON_PRESSED")) {
          reply = reply + "Action:BLINK";
        }

        if (chipInfo.includes("SWITCH:OFF") && (chip.switchStatus == "ON" || chip.switchStatus == "C_ON" )) {
          chip.switchStatus="ON";
          const newChip = new Chip(chip);
          newChip.save(error => {
            if (error) { return; }
            console.log('data logged in database');
          });
          reply = reply + "Action:ON";
        }

        if (chipInfo.includes("SWITCH:ON") && (chip.switchStatus == "OFF") || chip.switchStatus == "C_OFF" ){
          chip.switchStatus="OFF";
          const newChip = new Chip(chip);
          newChip.save(error => {
            if (error) { return; }
            console.log('data logged in database');
          });
          reply = reply + "Action:OFF";
        };
        sock.write(reply);
      })
      .catch(error => {
        return;
      });

  });

  sock.on('close', function () {
    console.log(`connection terminated`);
  });

  sock.on('error', function (error) {
    console.log(`error ${error}`);
  });
};


function getChips(req, res) {
  const docquery = Chip.find({});
  docquery
    .exec()
    .then(chips => {
      res.status(200).json(chips);
    })
    .catch(error => {
      res.status(500).send(error);
      return;
    });
}

function getChip(req, res) {
  const docquery = Chip.findOne({mac:req.params.mac});
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
    description: req.body.description,
    location: req.body.location,
  };
  const chip = new Chip(newChip);
  chip.save(error => {
    if (checkServerError(res, error)) return;
    res.status(201).json(chip);
    console.log('chip created');
  });
}

function updateChip(req, res) {

  const selectedChip = {
    mac: req.params.mac,
    description: req.body.description,
    location: req.body.location,
  };

  Chip.findOneAndUpdate({ mac: req.params.mac }, selectedChip)
    .then(chip => {
      res.status(200).json(chip);
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
      chip.switchStatus = "C_ON";
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
      chip.switchStatus = "C_OFF";
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