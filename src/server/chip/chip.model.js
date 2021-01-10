const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chipSchema = new Schema(
  {
    mac: { type: String, unique: true, required: true },
    name: { type: String },
    switchStatus: {type: String },
    activeAt: {type: Number },
    sensorData: {type: Number },
    power: {type: Number, min:0,max:100}
  },
  {
    collection: 'Chips'
  }
);

const Chip = mongoose.model('Chip', chipSchema);

module.exports = Chip;