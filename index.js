// Create a new client
const Discord = require("discord.js");
const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

// Log in the bot using token
const token = require("./config/token.json");
client.login(token.token);

// get bot config for eco server
const { prefix, channels, commands } = require("./config/config.json");

// Import morpion game
const { morpion_manager } = require("./morpion.js");

/* ============================
 * On connection / reconnection
 * ============================ */

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  client.channels.fetch(channels.bot).then((channel) => {
    channel.send(`${client.user.tag} est connecté`);
  });
});

client.on("reconnecting", () => {
  console.log(`This bot is reconnecting: ${client.user.tag}`);
});

/* ==============
 * On new message
 * ============== */

client.on("message", (message) => {
  const command_arg = message.content.toLowerCase().split(" ");
  const msgLower = command_arg[0];

  // Help command
  if (msgLower == prefix + commands.help.name) {
    const embed = new Discord.MessageEmbed()
      .setTitle(`Help manual of ${client.user.tag}`)
      .setColor(0x00ff00)
      .setDescription("Get every command of this bot!")
      .addField(
        `.${commands.help.name} ${commands.help.arg != undefined ? commands.help.arg : ""}`,
        `${commands.help.description}`
      )
      .addField(
        `.${commands.create.name} ${commands.create.arg != undefined ? commands.create.arg : ""}`,
        `${commands.create.description}`
      )
      .addField(
        `.${commands.join.name} ${commands.join.arg != undefined ? commands.join.arg : ""}`,
        `${commands.join.description}`
      )
      .addField(
        `.${commands.play.name} ${commands.play.arg != undefined ? commands.play.arg : ""}`,
        `${commands.play.description}`
      )
      .addField(
        `.${commands.leave.name} ${commands.leave.arg != undefined ? commands.leave.arg : ""}`,
        `${commands.leave.description}`
      );

    message.author.send(embed);

    // check if u can delete the message
    if (message.channel.type == "dm") return;
    message.delete();
  }

  // Morpion game
  morpion_manager(message, prefix, commands);
});

// Check for emoticons
client.on("messageReactionAdd", async (reaction, user) => {
  // When we receive a reaction we check if the reaction is partial or not
  if (reaction.partial) {
    // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
    try {
      await reaction.fetch();
    } catch (error) {
      console.log("Something went wrong when fetching the message: ", error);
      // Return as `reaction.message.author` may be undefined/null
      return;
    }
  }
});
