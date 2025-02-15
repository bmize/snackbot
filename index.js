require('dotenv').config();

const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });

// set up command listener
discordClient.commands = new Collection();
const commandsPath = path.join(__dirname, 'discord', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ('data' in command && 'execute' in command) {
    discordClient.commands.set(command.data.name, command);
  } else {
    console.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

// set up event listener
const eventsPath = path.join(__dirname, 'discord', 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);

  if (event.once) {
    discordClient.once(event.name, (...args) => event.execute(...args));
  } else {
    discordClient.on(event.name, (...args) => event.execute(...args));
  }
}

// log in to discord
discordClient.login(process.env.DISCORD_TOKEN);
