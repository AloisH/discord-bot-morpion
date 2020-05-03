const fs = require("fs");

/*  createGuildInformation --> get information of a gluid using is id and save it in a json format
 *  id = the guild id, client = client object of discord.js
 *  option = array of BOOLEAN :
 *  --> [0] = save roles information
 *  --> [1] = save channels information
 *  --> [2] = save membres informations
 */
function createGuildInformation(id, client, option = [true, true, true]) {
  // Get all guild information depending on the id
  const guildinfo = client.guilds.resolve(id);

  // Create an object to save guild information
  guild_json = {};
  guild_json.guild = {};

  // Add name and id to the object
  guild_json.guild.id = guildinfo.id;
  guild_json.guild.name = guildinfo.name;

  // Add every roles to the objects
  if (option[0]) {
    guild_json.guild.roles = {};
    guildinfo.roles.cache.forEach((value, key) => {
      guild_json.guild.roles[value.name] = {};
      guild_json.guild.roles[value.name].id = key;
    });
  }

  // Add every channels to the objects
  if (option[1]) {
    guild_json.guild.channels = {};
    guildinfo.channels.cache.forEach((value, key) => {
      guild_json.guild.channels[value.name] = {};
      guild_json.guild.channels[value.name].id = key;
    });
  }

  // Add every menbers to the objects
  if (option[2]) {
    guild_json.guild.members = {};
    guildinfo.members.cache.forEach((value, key) => {
      guild_json.guild.members[value.user.username] = {};
      guild_json.guild.members[value.user.username].id = key;
    });
  }

  // Save the object
  json_save(guildinfo.name, guild_json);
}

function json_save(name, json) {
  let data = JSON.stringify(json);
  fs.writeFileSync(`config/${name}.json`, data);
}

exports.createGuildInformation = createGuildInformation;
