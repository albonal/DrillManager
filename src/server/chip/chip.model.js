const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chipSchema = new Schema(
  {
    mac: { type: String, unique: true, required: true },
    description: { type: String },
    location: { type: String },
    sensorData: { type: String},
    switchStatus: {type: String} // This could be in the future a power output 0 (OFF):100(Max). For now ON/OFF
  },
  {
    collection: 'Chips'
  }
);

const Chip = mongoose.model('Chip', chipSchema);

module.exports = Chip;