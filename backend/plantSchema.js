import mongoose from "mongoose";

const plantSchema = mongoose.Schema({
  plantName: {
    type: String,
    required: true,
  },
  fertilizer: { type: String },
  Sunlight: {
    type: String,
    enum: ['Full Sunlight', 'Partial Sunlight', 'Shade']
  },
  whenToWater: {
    type: String,
    enum: ['Daily', 'Weekly', 'Biweekly']
  },
  lastWatered: {
    type : Date,
    default: Date.now
  }
});

const plantinfo = mongoose.model("plants", plantSchema);

export default plantinfo