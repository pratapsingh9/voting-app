const { string } = require("joi");
const mongoose = require("mongoose");
const url = "mongodb://localhost:27017";
const { model } = require(`mongoose`);
const { Schema } = require(`mongoose`);

mongoose
  .connect(url)
  .then(() => {
    console.log("mongooose conneted orm");
  })
  .catch((error) => {
    console.log(error);
  });

const PartySchema = Schema({
  name: {
    type: String,
    required: true,
  },
  Canditates: {
    type: Number,
    required: true,
  },
  Votes: {
    type: Number,
    default:0
  },
});

const CanditatesSchema = Schema({
  name: {
    type: string,
    required: true,
  },
  age: {
    type: string,
    required: true,
  },
  party: {
    type: String,
    ref: "Party",
  },
});

const PartyModel = mongoose.Model(`Party`, PartySchema);

module.exports = {
  PartyModel,
};
