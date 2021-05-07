import tmi from "tmi.js";
require('dotenv').config()
import { BLOCKED_WORDS } from "./constants";

const options = {
    options: { debug: true },
    identity: {
        username: process.env.BOT_USERNAME,
        password: process.env.OAUTH_TOKEN,
    },
    channels: [process.env.CHANNEL_NAME],
};

const client = new tmi.Client(options);

client.connect();

client.on("message", (channel, userState, message, self) => {
    // Ignore echoed messages.
    if (self) return;
    if (userState.username === process.env.BOT_USERNAME) return;
    if (message.toLowerCase() === "!hello") {
        // "@alca, heya!"
        client.say(channel, `@${userState.username}, heya!`);
    }

    checkTwitchChat(userState, message, channel);
});

function checkTwitchChat(userState, message, channel) {
    let shouldSendMessage = false;
    message = message.toLowerCase();
    shouldSendMessage = BLOCKED_WORDS.some((blockedWord) =>
        message.includes(blockedWord.toLowerCase())
    );

    if (shouldSendMessage) {
        client.say(
            channel,
            `Sorry! @${userState.username} your message was deleted!`
        );

        client.deletemessage(channel, userState.id);
    }
}
