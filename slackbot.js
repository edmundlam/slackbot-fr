var SlackBot = require("slackbots");
var config = require("./config");

console.log("Read config: " + JSON.stringify(config, null, 4));

// Initialize the bot
var bot = new SlackBot({
    token: config.token,
    name: config.name
});

// Parameters sent with messages
var params = {
    icon_emoji: ":cat:"
};

// Game status
var GameInfo = {
    active: false
};

bot.on("start", function () {

    bot.getChannelId(config.channelName).always(function (data) {
        if (data._status === 2) {
            config.channelId = data._value;
            bot.postMessage(config.channelId, "Bot started", params);
        } else {
            bot.getGroupId(config.channelName).always(function (data) {
                if (data._status === 2) {
                    config.channelId = data._value;
                    bot.postMessage(config.channelId, "Bot started", params);
                } else {
                    console.log("Could not find id for channel " + config.channelName);
                }
            });
        }
    });
});

bot.on("message", function (data) {
    /** Listen to incoming messages **/

    if (
        data.type === "message" &&
        data.subtype !== "bot_message" &&
        data.channel === config.channelId
    ) {

        if (data.text === "edbot start quiz") {
            startQuiz();
        }

        else if (data.text === "edbot stop quiz") {
            stopQuiz();
        }

        else if (data.text === "edbot shutdown") {
            postMessage("Shutting myself down").then(function () {process.exit();});
        }

        else if (data.text == "last message") {
            postMessage("Hello <@" + data.user + "> the last message was: " + history);
        }
        else if (GameInfo.active) {check_answer(data.text, data.user);}

        else {
            history = data.text;
            postMessage("Hello <@" + data.user + "> I got your message, it was: " + data.text);
        }
    }

    console.log(JSON.stringify(data, null, 4));
});

startQuiz = function () {
    if (GameInfo.active) {
        postMessage("Game already started!");
    } else {
        postMessage("Starting quiz!").then(function () {
            GameInfo.active = true;
            ask_question();
        });
    }
};

stopQuiz = function () {
    if (GameInfo.active) {
        postMessage("Stopping quiz");
        GameInfo.active = false;
    } else {
        postMessage("No game to stop!");
    }
};

ask_question = function () {
    postMessage("Conjuger le verbe aller dans cette phrase: Nous ______ à la bibliothèque");
    GameInfo.current_question = {};
    GameInfo.current_question.answer = "allons";
    GameInfo.current_question.full_answer = "Nous allons à la bibliothèque";
};

check_answer = function (message, user) {
    // check if message matches current answer
    if (message === GameInfo.current_question.answer) {
        postMessage("Hello <@" + user + "> is correct! " + GameInfo.current_question.full_answer)
        .then(function () {stopQuiz();});
    } else {
        postMessage("Sorry <@" + user + ">, " + message + " is not the right answer");
    }
};

postMessage = function (message) {
    return bot.postMessage(config.channelId, message, params);
};

module.exports = bot;