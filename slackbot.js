var SlackBot = require('slackbots');
var config = require('./config');

console.log("Read config: " +  JSON.stringify(config, null, 4))

// Initialize the bot
var bot = new SlackBot({
    token: config.token,
    name: config.name
});

var params = {
        icon_emoji: ':cat:'
};

bot.on('start', function() {
    bot.postMessageToGroup('test', 'Bot started', params);
})

bot.on('message', function(data) {
    /**
    **/

    if (data.type == 'message' && data.subtype != 'bot_message') {

        var channel = bot.groups.filter(function (item) {
            return item.id === data.channel
        });

        if (channel.length > 0 && channel[0].name === config.channel) {
            bot.postMessageToGroup(
                config.channel, 
                "Hello <@" + data.user + "> I got your message, it was: " + data.text, 
                params);
        }
    }

    console.log(JSON.stringify(data, null, 4))
})

module.exports = bot