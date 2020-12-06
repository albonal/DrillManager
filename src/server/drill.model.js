const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const drillSchema = new Schema(
  {
    id: { type: String, required: true},
    name: { type: String, required: true}
  },
  {
    collection: 'Drills'
  }
);

const Drill = mongoose.model('Drill', drillSchema);

module.exports = Drill;