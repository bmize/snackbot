import 'dotenv/config';

import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { readdirSync } from 'node:fs';

const discordClient = new Client({ intents: [GatewayIntentBits.Guilds] });

// set up command listener
discordClient.commands = new Collection();
const commandsPath = './discord/commands';
const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = `${commandsPath}/${file}`;
  const { command } = await import(filePath);

  if ('data' in command && 'execute' in command) {
    discordClient.commands.set(command.data.name, command);
  } else {
    console.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

// set up event listener
const eventsPath = './discord/events';
const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const { event } = await import(`${eventsPath}/${file}`);

  if (event.once) {
    discordClient.once(event.name, (...args) => event.execute(...args));
  } else {
    discordClient.on(event.name, (...args) => event.execute(...args));
  }
}

// log in to discord
discordClient.login(process.env.DISCORD_TOKEN);
