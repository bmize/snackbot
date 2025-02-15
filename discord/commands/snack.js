const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const constants = require('../../libs/constants');
const { isBlank } = require('../../libs/string-utils');
const SQLiteHandler = require('../../database/sqlite-handler');

const SNACKBOT_DB = new SQLiteHandler(constants.SNACKBOT_DB_PATH);

/**
 *
 * @param {Object} snack
 * @returns {EmbedBuilder}
 */
function buildEmbed(snack) {
  if (isBlank(snack?.Name)) {
    return null;
  }

  const embed = new EmbedBuilder().setColor(0xffc170).setTitle(snack.Name);

  if (!isBlank(snack.Origin)) {
    embed.setFields({ name: 'Origin', value: `${snack.Origin}` });
  }
  if (!isBlank(snack.Description)) {
    embed.setDescription(`${snack.Description}`);
  }
  if (!isBlank(snack.WikiUrl)) {
    embed.setURL(snack.WikiUrl);
  }
  if (!isBlank(snack.ImageUrl)) {
    embed.setImage(`${snack.ImageUrl}`);
  }

  return embed;
}

module.exports = {
  data: new SlashCommandBuilder().setName('snack').setDescription('Returns a random snack'),
  async execute(interaction) {
    const snack = await SNACKBOT_DB.get(
      'SELECT * FROM Snacks LIMIT 1 OFFSET ABS(RANDOM()) % MAX((SELECT COUNT(*) FROM Snacks), 1)',
    );
    try {
      const replyMsg = buildEmbed(snack);
      return interaction.reply({ embeds: [replyMsg] });
    } catch (error) {
      console.error(error);
      if (snack) {
        console.error(`Error getting snack from DB:\n${snack}`);
      }
      return interaction.reply("An error has occurred. I guess you'll have to wait for your next meal.");
    }
  },
};
