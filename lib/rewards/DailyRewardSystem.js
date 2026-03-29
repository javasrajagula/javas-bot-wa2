class DailyRewardSystem {
    constructor() {
        this.rewards = {};
        this.streaks = {};
        this.bonusMultipliers = {};
        this.specialEvents = {};
    }

    login(user) {
        const today = new Date().toISOString().split('T')[0];
        this.updateStreak(user, today);
        this.grantReward(user);
    }

    updateStreak(user, today) {
        if (!this.streaks[user]) {
            this.streaks[user] = { count: 0, lastLogin: null };
        }
        if (this.streaks[user].lastLogin === today) {
            return; // Already logged in today
        } else if (this.streaks[user].lastLogin) {
            const lastLoginDate = new Date(this.streaks[user].lastLogin);
            const diffDays = Math.ceil((new Date(today) - lastLoginDate) / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                this.streaks[user].count++;
            } else {
                this.streaks[user].count = 1;
            }
        } else {
            this.streaks[user].count = 1; // First login
        }
        this.streaks[user].lastLogin = today;
    }

    grantReward(user) {
        // Basic reward logic
        const baseReward = 100;
        const multiplier = this.getBonusMultiplier(user);
        const finalReward = baseReward * multiplier;
        console.log(`User ${user} received ${finalReward} coins.`);
        this.rewards[user] = this.rewards[user] ? this.rewards[user] + finalReward : finalReward;
    }

    getBonusMultiplier(user) {
        // This can be expanded to include logic for streaks or events.
        return this.bonusMultipliers[user] || 1;
    }

    registerSpecialEvent(name, reward) {
        // Logic to handle special event registration
        this.specialEvents[name] = reward;
        console.log(`Special event ${name} registered with reward: ${reward}`);
    }
}

// Example usage of DailyRewardSystem
const rewardSystem = new DailyRewardSystem();
// rewardSystem.login('user123');
// rewardSystem.registerSpecialEvent('Holiday Bonus', 500);
