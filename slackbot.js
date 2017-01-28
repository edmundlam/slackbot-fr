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

    bot.getChannelId(config.channelName).always(function(data) {
        if (data._status == 2) {
            config.channelId = data._value;
            bot.postMessage(config.channelId, 'Bot started', params);
        }
        else {
            bot.getGroupId(config.channelName).always(function(data) {
                if (data._status == 2) {
                    config.channelId = data._value;
                    bot.postMessage(config.channelId, 'Bot started', params);
                } else {
                    console.log("Could not find id for channel " + config.channelName)
                }
            })
        }
    })
})

bot.on('message', function(data) {
    /**
    **/

    if (data.type == 'message' &&
        data.subtype != 'bot_message' &&
        data.channel == config.channelId) {

            if (data.text === 'edbot shutdown') {
                bot.postMessage(config.channelId,
                                "Shutting myself down",
                                params
                                ).then(function() {
                                    process.exit()
                                })
            }

            else {
                bot.postMessage(
                    config.channelId,
                    "Hello <@" + data.user + "> I got your message, it was: " + data.text,
                    params);
            }
    }

    console.log(JSON.stringify(data, null, 4))
})

module.exports = bot