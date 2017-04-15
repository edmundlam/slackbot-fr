var SlackBot = require('slackbots');
var config = require('./config');

console.log("Read config: " +  JSON.stringify(config, null, 4))

// Initialize the bot
var bot = new SlackBot({
    token: config.token,
    name: config.name
});

// Parameters sent with messages
var params = {
        icon_emoji: ':cat:'
};

// Game status
var GameInfo = {
    active: false
}

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
    /** Listen to incoming messages **/

    if (data.type == 'message' &&
        data.subtype != 'bot_message' &&
        data.channel == config.channelId) {

            if (data.text === 'edbot start quiz') {
                start_quiz()
            }

            else if (data.text === 'edbot stop quiz') {
                stop_quiz()
            }

            else if (data.text === 'edbot shutdown') {
                post_message("Shutting myself down").then(function() {process.exit()})
            }

            else if (data.text == 'last message') {
                post_message("Hello <@" + data.user + "> the last message was: " + history);
            }

            else {
                history = data.text
                post_message("Hello <@" + data.user + "> I got your message, it was: " + data.text);
            }
    }

    console.log(JSON.stringify(data, null, 4))
})

start_quiz = function() {
    if (GameInfo.active) {
        post_message("Game already started!")
    } else {
        post_message("Starting quiz!")
        GameInfo.active = true
    }
}

stop_quiz = function() {
    if (GameInfo.active) {
        post_message("Stopping quiz")
        GameInfo.active = false
    } else {
        post_message("No game to stop!")
    }
}

post_message = function(message) {
    return bot.postMessage(config.channelId, message, params);
}

module.exports = bot