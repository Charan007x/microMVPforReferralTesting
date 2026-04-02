import User from '../models/user.js';
import Wallet from '../models/wallet.js';
import UserTransaction from '../models/userTransaction.js';
export const subscribeUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const subscriptionCost = 300;
        const transaction = new UserTransaction({
            user: userId,
            amount: subscriptionCost,
            type: 'debit',
            status: 'completed', // Assuming instant successful payment for MVP
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await transaction.save();
        if (transaction.status === 'completed') {
            user.premium = true;
            user.premiumDaysRemaining += 30;
            await user.save();
            if (user.referredBy && !user.referralRewardGiven) {
                const referrer = await User.findById(user.referredBy);
                const rewardAmount = 100;
                const referrerWallet = await Wallet.findOne({ user: referrer._id });
                if (referrerWallet) {
                    referrerWallet.balance += rewardAmount;
                    await referrerWallet.save();
                    const rewardTransaction = new UserTransaction({
                        user: referrer._id,
                        amount: rewardAmount,
                        type: 'credit',
                        status: 'completed',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                    await rewardTransaction.save();
                    user.referralRewardGiven = true;
                    await user.save();
                }
            }
            res.status(200).json({ message: "Subscription successful" });
        } else {
            res.status(400).json({ message: "Subscription failed" });
        }
    } catch (err) {
        console.error("Error in subscribeUser:", err);
        res.status(500).json({ message: "Internal server error" });
    }
};