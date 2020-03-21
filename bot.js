const Telegraf = require("telegraf");
const { extractCommonData } = require("./utils");
const { getTrendingSymbols } = require("./supportedMethods");


const launchBot = () => {
  const botReactions = ["👍", "👌", "👆💪", "👏", "👀", "🤦‍♀️🤣", "😎"];

  const helpMessage = `
Hi there, I'm a Stocktwits bot and here to give you quick overview of interesting insights from Stocktwits.
Here's how it works:
1. /list - will show you all the currently supported methods I can expose for you
2. TBD
😎
`;

  const listMessage = `Here is what I can do:

  * /getTrending <limit:number:optional> <ordered:string:optional> - Will return the top trending stocks.
  limit (1-30) will provide only the top <limit> results, ordered ("ordered") will order the results by how many users are watching that stock
  `;

  const bot = new Telegraf(process.env.BOT_TOKEN);

  bot.help(ctx => ctx.reply(helpMessage));

  // Note, order of events is important

  bot.command("list", ctx => {
    const { isGroup, groupId, username } = extractCommonData(ctx);
    ctx.telegram.sendMessage(ctx.message.chat.id, listMessage);
  });

  bot.command("getTrending", async ctx => {
    const params = ctx.message.text.split(" ").slice(1);

    // First, asserting that everything is okay

    if (params.length > 2) {
      ctx.telegram.sendMessage(
        ctx.message.chat.id,
        "Sorry, I can take maximum two parameters in this method"
      );
      return;
    }
    if (params.length >= 1 && isNaN(params[0])) {
      // console.log(params[0]);
      // console.log(typeof params[0]);
      // console.log(isNaN(params[0]));
      ctx.telegram.sendMessage(
        ctx.message.chat.id,
        "Your <limit> param is not a number"
      );
      return;
    }
    if (params.length == 2 && params[1] !== "ordered") {
      ctx.telegram.sendMessage(
        ctx.message.chat.id,
        'Your <ordered> param must be "ordered"'
      );
      return;
    }

    // Everything is okay. Answering
    const res = await getTrendingSymbols(limit=Number(params[0]), orderWatchlist=params[1]=== "ordered");
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      res
    );
    return;
  });


  // Regular flow of messages in the group
  bot.on("message", ctx => {
    const { isGroup, groupId, username } = extractCommonData(ctx);

    // if (!isGroup) {
    //   ctx.telegram.sendMessage(
    //     groupId,
    //     "This is not a group... I'm a social guy, show me some company"
    //   );
    //   return;
    // }

    const groupName = ctx.message.chat.title;

    // ctx.telegram.sendMessage(groupId, `Hi ${username}`);

    if (
      ctx.message.left_chat_participant &&
      ctx.message.left_chat_participant.username === process.env.BOT_NAME
    ) {
      // Bot was removed from group
      // TODO:
    }

    // Adding the bot to a new group event
    if (
      ctx.message.new_chat_participant &&
      ctx.message.new_chat_participant.username === process.env.BOT_NAME
    ) {
      console.log("Bot joined group: ", groupName);
      try {
        ctx.telegram
          .sendMessage(groupId, `${groupName}, it is a pleasure to be here!`)
          .then(() => ctx.telegram.sendMessage(groupId, helpMessage));
      } catch (err) {
        console.log(`error: ${JSON.stringify(err)}`);
      }
    }

    // Main operation, listening to messages and acting accordingly
    if (ctx.message.text === "👍") {
      ctx.telegram.sendMessage(ctx.message.chat.id, `I'm happy that you're happy ${username}`);
    }
  });

  // main polling of bot
  bot.launch();
};

module.exports = {
  launchBot
};
