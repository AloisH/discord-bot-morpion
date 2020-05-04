# Discord-bot morpion game

Discord-bot-morpion is a way to play "morpion" game inside a discord server

    - You can create a game
    - Join a game
    - Play a game
    - Leave a game

## News

Removed most of the commands :

    - Play
    - Leave
    - Join

Now, you can use emoji to interact with the bot

    - 👥 To join a game
    - ❌ To leave a game
    - 7️⃣ to play a game

## Installation

[Git clone the project][github]

You have to create a token.json file inside config like this one

```js
{
    "token": "your discord token"
}
```

You can find your discord token [here][discord-token]

Before starting the bot, be sure to have all the dependencie ([discordjs])

To start the bot use "node index.js" !

## Use the bot

The morpion bot have 2 commands :

    - .help ➡ give information about every commands
    - .create ➡ create a morpion game

[github]: https://github.com/AloisH/discord-bot-morpion.git
[discord-token]: https://discordapp.com/developers/applications
[discordjs]: https://discord.js.org/#/
