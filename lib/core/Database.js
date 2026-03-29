'use strict';

const { MongoClient } = require('mongodb');

class Database {
    constructor() {
        this.url = 'mongodb://localhost:27017'; // Update with your MongoDB URL
        this.dbName = 'gameDB'; // Name of the database
        this.client = new MongoClient(this.url, { useNewUrlParser: true, useUnifiedTopology: true });
        this.database = null;
    }

    async connect() {
        try {
            await this.client.connect();
            this.database = this.client.db(this.dbName);
            console.log('Connected to database:', this.dbName);
        } catch (error) {
            console.error('Database connection error:', error);
        }
    }

    async createPlayerData(playerId, data) {
        try {
            const collection = this.database.collection('playerData');
            const result = await collection.insertOne({ playerId, ...data });
            return result;
        } catch (error) {
            console.error('Error creating player data:', error);
        }
    }

    async getPlayerData(playerId) {
        try {
            const collection = this.database.collection('playerData');
            return await collection.findOne({ playerId });
        } catch (error) {
            console.error('Error fetching player data:', error);
        }
    }

    async updateGameState(gameState) {
        try {
            const collection = this.database.collection('gameState');
            await collection.updateOne({}, { $set: gameState }, { upsert: true });
        } catch (error) {
            console.error('Error updating game state:', error);
        }
    }

    async getUserStatistics(userId) {
        try {
            const collection = this.database.collection('userStatistics');
            return await collection.findOne({ userId });
        } catch (error) {
            console.error('Error fetching user statistics:', error);
        }
    }

    async close() {
        await this.client.close();
    }
}

module.exports = new Database();