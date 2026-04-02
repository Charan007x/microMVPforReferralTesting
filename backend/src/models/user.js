import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
    },
    password:{
    type: String,
    required: true
    },
  referralCode: {
    type: String,
    unique: true,
    index: true
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  referralRewardGiven: {
    type: Boolean,
    default: false
  },
  premium: {
    type: Boolean,
    default: false
  },
  premiumDaysRemaining: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
const User = mongoose.model("User", userSchema);
export default User;