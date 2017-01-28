var SlackBot = require('slackbots');
var config = require('./config');

console.log("Read config: " +  config)
console.log(config)

// Initialize the bot
var bot = new SlackBot({
    token: config.token,
    name: config.name
});


bot.on('start', function() {
    var params = {
        icon_emoji: ':cat:'
    };

    bot.postMessageToUser('edmund', 'Bot started', params); 
})


module.exports = bot