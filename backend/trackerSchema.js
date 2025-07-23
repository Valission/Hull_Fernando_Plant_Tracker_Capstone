import mongoose from "mongoose";

const logsSchema = mongoose.Schema({
    plant:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'plants',
        required: true
    },
    action: {
        type: [String],
        enum: ["watered", "Fertilized", "Repotted"],
        required: true
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
    
}, {timestamps: true})

const userLog = mongoose.model("logs", logsSchema)
export default userLog