const Chip = require('./chip.model');
const Status = require('./led');

function getChips(req,res) {
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

function postChip(req,res) {
    const newChip = {mac: req.body.mac,
                     description: req.body.description,
                     location: req.body.location  };
    const chip = new Chip(newChip);
    chip.save(error => {
        if (checkServerError(res, error)) return;
        res.status(201).json(chip);
        console.log('chip created');
    });
}

function updateChip(req, res) {
 
  const selectedChip = {mac: req.params.mac,
    description: req.body.description,
    location: req.body.location  };
    
    Chip.findOneAndUpdate({ mac: req.params.mac },selectedChip)
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

function checkFound(res, chip) {
  if (!chip) {
    res.status(404).send('Chip not found.');
    return;
  }
  return hero;
}

function turnOnLED(req,res) {

  Status.setStatus(req.body.mac,"ON");
  res.status(200).json();
      console.log('turnOnLED');
}

function turnOffLED(req,res) {

  Status.setStatus(req.body.mac,"OFF");
  res.status(200).json();
  console.log('turnOffLED');
}

function checkServerError(res, error) {
    if (error) {
        res.status(500).send(error);
        return error;
    }
}

module.exports = {
  getChips,
  postChip,
  updateChip,
  deleteChip,
  turnOnLED,
  turnOffLED,
  
};