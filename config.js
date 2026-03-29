module.exports = {
    botName: 'MyBot',
    version: '1.0.0',
    database: {
        host: 'localhost',
        port: 27017,
        name: 'myBotDB'
    },
    apiKeys: {
        service1: 'YOUR_API_KEY_1',
        service2: 'YOUR_API_KEY_2'
    },
    gameSettings: {
        difficulty: 'normal',
        maxPlayers: 4
    },
    cooldowns: {
        command1: 5000,
        command2: 3000
    },
    adminList: ['user1', 'user2', 'user3']
};