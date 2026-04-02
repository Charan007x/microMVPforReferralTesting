import mongoose from "mongoose";
const userTransactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['credit', 'debit'],
        required: true
    },
    status:{
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    createdAt: Date,
    updatedAt: Date
});     
 const UserTransaction = mongoose.model("UserTransaction", userTransactionSchema);
 export default UserTransaction;