import User from '../models/user.js';
import Wallet from '../models/wallet.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateRandomReferralCode } from '../services/referralService.js';
export const registerUser = async (req, res) => {
    try {
        const { username, password,referredBy } = req.body;
        if(!username || !password){
            return res.status(400).json({ message: "Username and password are required" });
        }
        // Check if username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }
        const referrer = referredBy ? await User.findOne({ referralCode: referredBy }) : null;
        if (referredBy && !referrer) {
            return res.status(400).json({ message: "Invalid referral code" });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const getcode = generateRandomReferralCode();
        const newUser = new User({
            username,
            password: hashedPassword,
            referralCode: getcode,
            referredBy: referrer ? referrer._id : null
        });
        await newUser.save();

        // Create a wallet for the new user
        const newWallet = new Wallet({
            user: newUser._id,
            balance: 0
        });
        await newWallet.save();

        res.status(201).json({ message: "User registered successfully" });
    }catch(err){
        console.error("Error in registerUser:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if(!username || !password){
            return res.status(400).json({ message: "Username and password are required" });
        }
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ 
            message: "User logged in successfully", 
            token,
            user: {
                username: user.username,
                referralCode: user.referralCode
            }
        });
        console.log("User logged in:", user.username);

    }catch(err){
        console.error("Error in loginUser:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};