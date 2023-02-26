const path = require('path');
const dbPath = path.join(__dirname, '..', '..', 'database');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const SQLiteHandler = require(path.join(dbPath, 'sqlite-handler.js'));

const db = new SQLiteHandler(path.join(dbPath, 'snackbot.db'));

/**
 *
 * @param {string} snack
 * @returns {EmbedBuilder}
 */
function buildEmbed(snack) {
  if (snack == null || snack.Name === null || snack.Name === '') {
    return null;
  }

  const embed = new EmbedBuilder().setColor(0xffc170).setTitle(snack.Name);

  if (snack.Origin !== null && snack.Origin !== '') {
    embed.setFields({ name: 'Origin', value: `${snack.Origin}` });
  }
  if (snack.Description !== null && snack.Description !== '') {
    embed.setDescription(`${snack.Description}`);
  }
  if (snack.WikiUrl !== null && snack.WikiUrl !== '') {
    embed.setURL(snack.WikiUrl);
  }
  if (snack.ImageUrl !== null && snack.ImageUrl !== '') {
    embed.setImage(`${snack.ImageUrl}`);
  }

  return embed;
}

module.exports = {
  data: new SlashCommandBuilder().setName('snack').setDescription('Returns a random snack'),
  async execute(interaction) {
    const snack = await db.get(
      'SELECT * FROM Snacks LIMIT 1 OFFSET ABS(RANDOM()) % MAX((SELECT COUNT(*) FROM Snacks), 1)'
    );
    try {
      const replyMsg = buildEmbed(snack);
      return interaction.reply({ embeds: [replyMsg] });
    } catch (error) {
      console.error(error);
      if (snack) {
        console.error({
          name: snack.Name,
          origin: snack.Origin,
          description: snack.Description,
          wikiUrl: snack.WikiUrl,
          imageUrl: snack.ImageUrl,
        });
      }
      return interaction.reply(
        "An error has occurred. I guess you'll have to wait for your next meal."
      );
    }
  },
};
