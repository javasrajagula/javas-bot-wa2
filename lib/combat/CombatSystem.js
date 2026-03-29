class CombatSystem {
    constructor() {
        this.players = [];
        this.battleLogs = [];
    }

    addPlayer(player) {
        this.players.push(player);
    }

    removePlayer(player) {
        this.players = this.players.filter(p => p.id !== player.id);
    }

    performAttack(attacker, defender) {
        const damage = attacker.attack();
        defender.takeDamage(damage);
        this.logBattle(`${attacker.name} attacks ${defender.name} for ${damage} damage.`);
    }

    logBattle(message) {
        const timestamp = new Date().toISOString();
        this.battleLogs.push(`${timestamp} - ${message}`);
    }

    getBattleLogs() {
        return this.battleLogs;
    }
}

// Example player class
class Player {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.health = 100;
        this.attackPower = 10;
    }

    attack() {
        return this.attackPower;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        console.log(`${this.name} has died.`);
        // Additional logic for player death, like removing from combat
    }
}

// Example usage:
const combatSystem = new CombatSystem();
const player1 = new Player('Hero', '1');
const player2 = new Player('Villain', '2');
combatSystem.addPlayer(player1);
combatSystem.addPlayer(player2);
combatSystem.performAttack(player1, player2);
console.log(combatSystem.getBattleLogs());