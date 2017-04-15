var SlackBot = require("slackbots");
var config = require("./config");
var questionBank = require("./questionBank");

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
    active: false,
    counter: 0
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
        else if (GameInfo.active) {checkAnswer(data.text, data.user);}

        // else {
        //     history = data.text;
        //     postMessage("Hello <@" + data.user + "> I got your message, it was: " + data.text);
        // }
    }

    console.log(JSON.stringify(data, null, 4));
});

startQuiz = function () {
    if (GameInfo.active) {
        postMessage("Game already started!");
    } else {
        postMessage("Starting quiz!").then(function () {
            GameInfo.active = true;
            GameInfo.counter = 0;
            GameInfo.currentQuestion = questionBank[0];
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
    postMessage(GameInfo.currentQuestion.fullQuestion());
};

nextQuestion = function () {
    //if there are questions left, then ask next question
    //if not, end the game
    if (GameInfo.counter < questionBank.length - 1) {
        GameInfo.counter++;
        GameInfo.currentQuestion = questionBank[GameInfo.counter];
        postMessage("Next question in 4 seconds")
        setTimeout(ask_question, 4000);
    } else {
        stopQuiz();
    }
};

checkAnswer = function (message, user) {
    // check if message matches current answer
    if (message === GameInfo.currentQuestion.answer) {
        postMessage("<@" + user + "> is correct! " + GameInfo.currentQuestion.fullAnswer())
        .then(function () {nextQuestion();});
    } else {
        postMessage("Sorry <@" + user + ">, " + message + " is not the right answer");
    }
};

postMessage = function (message) {
    return bot.postMessage(config.channelId, message, params);
};

module.exports = bot;