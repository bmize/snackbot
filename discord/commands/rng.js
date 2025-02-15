const { SlashCommandBuilder } = require('discord.js');

/**
 *
 * @param {number} sides The number of sides on the die
 * @returns {number}
 */
function rollDie(sides) {
  if (Number.isInteger(sides)) {
    return Math.floor(Math.random() * sides) + 1;
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Rolls dice in standard D&D style (e.g. "2d6")')
    .addIntegerOption((option) =>
      option
        .setName('count')
        .setDescription('The number of dice you want to roll.')
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option
        .setName('sides')
        .setDescription('The number of sides on each die being rolled.')
        .setMinValue(2)
        .setMaxValue(1000000000)
        .setRequired(true),
    ),
  async execute(interaction) {
    const count = interaction.options.getInteger('count');
    const sides = interaction.options.getInteger('sides');
    if (count && sides) {
      const rolls = Array.from({ length: count }, (value, index) => rollDie(sides));
      return interaction.reply(`🎲 Rolling **${count}d${sides}** 🎲\nYou rolled... **${rolls.join(', ')}**`);
    } else {
      return interaction.reply('Required values were missing.');
    }
  },
};
