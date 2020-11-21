const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const drillSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true},
    name: String
  },
  {
    collection: 'Drills'
  }
);

const Drill = mongoose.model('Drill', drillSchema);

module.exports = Drill;