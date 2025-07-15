import mongoose from "mongoose";

<<<<<<< HEAD
const plantSchema = mongoose.Schema({
=======
const schema = mongoose.Schema({
>>>>>>> cd8b9cb955da58054a51e4ad666aeb193cf750fe
  plantName: {
    type: String,
    required: true,
  },
  fertilizer: { type: String },
<<<<<<< HEAD
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
=======
  directSunlight: { type: Boolean, default: true },
});

const plantinfo = mongoose.model("plants", schema);

export default plantinfo
>>>>>>> cd8b9cb955da58054a51e4ad666aeb193cf750fe
