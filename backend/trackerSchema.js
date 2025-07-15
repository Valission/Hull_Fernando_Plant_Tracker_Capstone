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
    
}, {timestamp: true})

const log = mongoose.model("logs", logsSchema)
export default log