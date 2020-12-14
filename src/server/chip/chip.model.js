const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const chipSchema = new Schema(
  {
    mac:         { type: String, unique: true, required: true},
    description: { type: String},
    location:    { type: String},

  },
  {
    collection: 'Chips'
  }
);

const Chip = mongoose.model('Chip', chipSchema);

module.exports = Chip;