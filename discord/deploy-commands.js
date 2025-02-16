import { config } from 'dotenv';
config({ path: '../.env' });

import { readdirSync } from 'node:fs';
import { REST, Routes } from 'discord.js';

const commands = [];
const commandsPath = './commands';
const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = `${commandsPath}/${file}`;
  const { command } = await import(filePath);

  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// deploy commands
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
    const data = await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands });
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();
