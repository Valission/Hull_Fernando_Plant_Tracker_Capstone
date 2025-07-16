import mongoose from "mongoose";

const logsSchema = mongoose.Schema({
    plant:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'plants',
        required: true
    },
    action: {
        type: String,
        enum: ["watered", "Fertilized", "Repotted"],
        required: true
    },
    Date: {
        type: Date,
        default: Date.now
    },
    note: {
        type: String,
    },
    imageUrls:{
        type: [String],
        default: []
    },
    belongedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
  }
    
}, {timestamp: true})

const userLog = mongoose.model("logs", logsSchema)
export default userLog