// models/Counter.js
const mongoose = require("mongoose");

const CounterSchema = new mongoose.Schema({
  name: { type: String, required: true, },
  sequence: { type: Number, default: 1 },
});

module.exports = mongoose.model("Counter", CounterSchema);
