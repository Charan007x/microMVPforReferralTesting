import Wallet from "../models/wallet.js";
export const getWallet = async (req, res) => {
    try {
        const userId = req.user.userId;
        const wallet = await Wallet.findOne({ user: userId });
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }
        res.status(200).json({ balance: wallet.balance });
    } catch (err) {
        console.error("Error in getWallet:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};