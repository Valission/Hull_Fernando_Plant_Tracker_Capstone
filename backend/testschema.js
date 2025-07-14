import mongoose from "mongoose";

const schema = mongoose.Schema({
  plantName: {
    type: String,
    required: true,
  },
  fertilizer: { type: String },
  directSunlight: { type: Boolean, default: true },
});

const plantinfo = mongoose.model("plants", schema);

export default plantinfo