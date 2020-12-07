const Drill = require('./drill.model');
const Status = require('./led');

function getDrills(req,res) {
  const docquery = Drill.find({});
  docquery
    .exec()
    .then(drills => {
      res.status(200).json(drills);
    })
    .catch(error => {
      res.status(500).send(error);
      return;
    });
}

function postDrill(req,res) {
    const originalDrill = {id: req.body.id, name: req.body.name };
    const drill = new Drill(originalDrill);
    drill.save(error => {
        if (checkServerError(res, error)) return;
        res.status(201).json(drill);
        console.log('drill created');
    });
}

function turnOnLED(req,res) {

  Status.setStatus("ON");
  res.status(200).json();
      console.log('turnOnLED');
}

function turnOffLED(req,res) {

  Status.setStatus("OFF");
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
  getDrills,
  postDrill,
  turnOnLED,
  turnOffLED,
  
};