// CommandHandler.js

class CommandHandler {
    constructor() {
        this.commands = new Map();
        this.cooldowns = new Map();
    }

    registerCommand(name, command) {
        this.commands.set(name, command);
    }

    setCooldown(commandName, userId, time) {
        const commandCooldowns = this.cooldowns.get(commandName) || new Map();
        commandCooldowns.set(userId, Date.now() + time);
        this.cooldowns.set(commandName, commandCooldowns);
    }

    isOnCooldown(commandName, userId) {
        const commandCooldowns = this.cooldowns.get(commandName);
        if (!commandCooldowns) return false;
        return commandCooldowns.has(userId) && Date.now() < commandCooldowns.get(userId);
    }

    execute(commandName, userId, ...args) {
        if (this.isOnCooldown(commandName, userId)) {
            return `Command is on cooldown for user ${userId}.`; 
        }

        const command = this.commands.get(commandName);
        if (command) {
            this.setCooldown(commandName, userId, command.cooldown || 0);
            return command.execute(...args);
        } else {
            return `Command ${commandName} not found.`;
        }
    }

    addAlias(alias, commandName) {
        if (this.commands.has(commandName)) {
            this.commands.set(alias, this.commands.get(commandName));
        }
    }
}

module.exports = CommandHandler;