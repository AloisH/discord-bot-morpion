const Discord = require("discord.js");

// Create a game object to store current game
let games = {};

// Functionc to check what commands to execute
function morpion_manager(message, prefix, commands) {
  // Get argument
  const command_arg = message.content.toLowerCase().split(" ");
  const msgLower = command_arg[0];

  // Create a game
  if (msgLower == prefix + commands.create.name) {
    const embed = create_game(message.author);
    message.channel.send(embed);
  }
  // Join a game
  else if (msgLower == prefix + commands.join.name) {
    const game_id = message.mentions.users.size != 0 ? message.mentions.users.entries().next().value[0] : undefined;
    const embed = join_game(message.author, game_id);

    message.channel.send(embed);
  }
  // Play your turn
  else if (msgLower == prefix + commands.play.name) {
    const embed = play(message.author, command_arg[1]);
    message.channel.send(embed);
  }
  // Leava a game
  else if (msgLower == prefix + commands.leave.name) {
    const embed = leave(message.author);
    message.channel.send(embed);
  }
}

// Create a new game
function create_game(author) {
  // Return if author has already a game !
  if (games[author.id] != undefined) return err_embed("Vous avez déjà une partie en cours !");

  games[author.id] = {};
  games[author.id].player1 = author.id;
  games[author.id].player1_name = author.username;
  games[author.id].board = "_________";
  games[author.id].play = author.id;

  let embed = new Discord.MessageEmbed()
    .setAuthor(author.username, author.avatarURL())
    .setTitle(`Morpion game - Partie de ${author.username}`)
    .setColor(0x00ff00)
    .addField("En attente d'un joueur !", `Pour rejoindre la partie : .join @${author.username}`);
  embed = print_board(embed, author.id);
  return embed;
}

function join_game(author, game_id) {
  let embed = new Discord.MessageEmbed().setTitle(`Morpion game`).setColor(0xff0000);

  if (game_id == undefined) {
    embed.setDescription("Vous devez mentionné quelqu'un ! .join @username");
    return embed;
  }

  if (games[author.id] != undefined) {
    embed.setDescription("Vous avez déjà une partie en cours !");
    return embed;
  }

  if (games[game_id] == undefined) {
    embed.setDescription(`Le joueur mentionné n'a pas de partie en cours ! .join @username`);
    return embed;
  }

  if (games[game_id].player2 != undefined) {
    embed.setDescription(`Le joueur mentionné à déjà une partie en cours !`);
    return embed;
  }

  games[author.id] = {};
  games[author.id].id = game_id;
  games[game_id].player2 = author.id;
  games[game_id].player2_name = author.username;

  embed = new Discord.MessageEmbed()
    .setAuthor(author.username, author.avatarURL())
    .setTitle(`Morpion game - Partie de ${games[game_id].player1_name}`)
    .setColor(0x00ff00);
  embed = print_current_player(embed, game_id);
  embed = print_board(embed, game_id);

  return embed;
}

function play(author, nbr) {
  if (games[author.id] == undefined) {
    return err_embed("Vous n'etes pas dans une partie !");
  }

  if (nbr == undefined) {
    return err_embed("Vous devez préciser une places (entre 1 et 9) !");
  }

  let game_id = author.id;
  if (games[author.id].id != undefined) {
    game_id = games[author.id].id;
  }

  if (games[game_id].player2 == undefined) {
    return err_embed("En attendent d'un joueur !");
  }

  if (games[game_id].play != author.id) {
    return err_embed("Ce n'est pas votre tour !");
  }

  let place = parseInt(nbr);
  if (isNaN(place) || place < 1 || place > 9) {
    return err_embed("Nombre invalide (entre 1 et 9)");
  }

  place -= 1;
  if (games[game_id].board[place] != "_") {
    return err_embed("Case déjà prise !");
  }

  let symbol = "x";
  games[game_id].play = games[game_id].player2;
  if (games[game_id].player2 == author.id) {
    symbol = "o";
    games[game_id].play = games[game_id].player1;
  }

  let new_board = games[game_id].board.replaceAt(place, symbol);
  games[game_id].board = new_board;

  let win = check_win(game_id, symbol);

  let embed;
  if (win == 0) {
    embed = new Discord.MessageEmbed()
      .setAuthor(author.username, author.avatarURL())
      .setTitle(`Morpion game - Partie de ${games[game_id].player1_name}`)
      .setColor(0x00ff00);
    embed = print_current_player(embed, game_id);
    embed = print_board(embed, game_id);

    return embed;
  } else if (win == 1) {
    embed = new Discord.MessageEmbed()
      .setAuthor(author.username, author.avatarURL())
      .setTitle(`Morpion game - Partie de ${games[game_id].player1_name}`)
      .setColor(0x00ff00)
      .addField("😱", `${author.username} a gagné !`);

    embed = print_board(embed, game_id);
    games[games[game_id].player2] = undefined;
    games[games[game_id].player1] = undefined;
    return embed;
  } else if (win == 2) {
    embed = new Discord.MessageEmbed()
      .setAuthor(author.username, author.avatarURL())
      .setTitle(`Morpion game - Partie de ${games[game_id].player1_name}`)
      .setColor(0x00ff00)
      .addField(`🙄`, `Personne n'a gagné !`);

    embed = print_board(embed, game_id);
    games[games[game_id].player2] = undefined;
    games[games[game_id].player1] = undefined;
    return embed;
  }

  return embed;
}

function check_win(id, symbol) {
  if (
    (games[id].board[0] == symbol && games[id].board[1] == symbol && games[id].board[2] == symbol) ||
    (games[id].board[3] == symbol && games[id].board[4] == symbol && games[id].board[5] == symbol) ||
    (games[id].board[6] == symbol && games[id].board[7] == symbol && games[id].board[8] == symbol) ||
    (games[id].board[0] == symbol && games[id].board[3] == symbol && games[id].board[6] == symbol) ||
    (games[id].board[1] == symbol && games[id].board[4] == symbol && games[id].board[7] == symbol) ||
    (games[id].board[3] == symbol && games[id].board[5] == symbol && games[id].board[9] == symbol) ||
    (games[id].board[0] == symbol && games[id].board[4] == symbol && games[id].board[8] == symbol) ||
    (games[id].board[2] == symbol && games[id].board[4] == symbol && games[id].board[6] == symbol)
  ) {
    console.log("A player as win !");
    return 1;
  }

  if (games[id].board.includes("_") == false) {
    return 2;
  }

  return 0;
}

function leave(author) {
  if (games[author.id] == undefined) {
    return err_embed("Vous n'avez pas de partie en cours !");
  }

  let embed = err_embed(`${author.username} a abandonné la partie !`);

  if (games[author.id].id == undefined) {
    if (games[author.id].player2 != undefined) {
      games[games[author.id].player2] = undefined;
    }
    games[author.id] = undefined;
  } else {
    games[games[author.id].id] = undefined;
    games[author.id] = undefined;
  }
  return embed;
}

// Print board of a game in an embed messgae
function print_board(embed, id) {
  return embed.setDescription(
    ` \`\`\`\n 
    ${games[id].board[0]} | ${games[id].board[1]} | ${games[id].board[2]}\n
    ${games[id].board[3]} | ${games[id].board[4]} | ${games[id].board[5]}\n 
    ${games[id].board[6]} | ${games[id].board[7]} | ${games[id].board[8]}\n \`\`\` `
  );
}

// Print the current player turn
function print_current_player(embed, game_id) {
  let play = "";
  if (games[game_id].play == game_id) {
    play = games[game_id].player1_name;
  } else {
    play = games[game_id].player2_name;
  }

  return embed.addField(`${games[game_id].player1_name} vs ${games[game_id].player2_name}`, `C'est le tour de ${play}`);
}

// Handle embed err message
function err_embed(message) {
  let embed = new Discord.MessageEmbed().setTitle(`Morpion game`).setColor(0xff0000).setDescription(message);

  return embed;
}

// This function is used to replace a char in a string
String.prototype.replaceAt = function (index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

// Export all necessary function
exports.morpion_manager = morpion_manager;
