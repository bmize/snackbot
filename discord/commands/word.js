const cheerio = require('cheerio');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

let wordOfTheDay = null;

/**
 *
 * @param {string} date
 * @returns {boolean} true if the date is in ISO format (YYYY-mm-DD)
 */
function isISODate(date) {
  if (date !== null && date !== '') {
    // Checks if date is in YYYY-mm-DD format from 1900-01-01 through 2099-12-31
    const regex = new RegExp('^(19|20)\\d\\d-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$');
    if (regex.test(date)) {
      return true;
    }
  }
  return false;
}

/**
 *
 * @param {string} date
 * @returns {Promise<DailyWord>}
 */
async function fetchNewWord(date = '') {
  try {
    if (date === null || date === '') {
      date = new Date().toISOString().split('T')[0];
    } else if (!isISODate(date)) {
      return null;
    }

    const response = await fetch(`https://www.merriam-webster.com/word-of-the-day/${date}`);
    const body = await response.text();
    const $ = cheerio.load(body);
    // const $dateText = $('div.article-header-container.wod-article-header > div.w-a-title > span').text().split(':')[1].trim();
    const $word = $('div.article-header-container.wod-article-header div.word-header h2').text();
    const $definition = $('div.wod-definition-container > p:nth-child(2)').text();
    const result = {
      date: date,
      word: $word,
      definition: $definition,
    };
    return result;
  } catch (error) {
    console.error(error);
  }
}

/**
 * @typedef {{date: string, word: string, definition: string}} DailyWord
 * @param {string} date
 * @returns {Promise<DailyWord>}
 */
async function getDailyWord(date = '') {
  try {
    if (date === null || date === '') {
      date = new Date().toISOString().split('T')[0];
    } else if (!isISODate(date)) {
      return null;
    }

    const today = new Date().toISOString().split('T')[0];
    if ((date === '' || date === today) && wordOfTheDay !== null && wordOfTheDay.date === today) {
      return wordOfTheDay;
    }

    const dailyWord = await fetchNewWord(date);
    if (date === today) {
      wordOfTheDay = dailyWord;
    }
    return dailyWord;
  } catch (error) {
    console.error(error);
  }
}

/**
 *
 * @param {DailyWord} dailyWord
 * @returns {EmbedBuilder}
 */
function buildEmbed(dailyWord) {
  if (dailyWord == null || dailyWord.word === null || dailyWord.word === '') {
    return null;
  }

  const embed = new EmbedBuilder().setColor(0xffc170).setTitle(dailyWord.word);

  if (dailyWord.date !== null && dailyWord.date !== '') {
    embed.setFields({ name: 'Date', value: `${dailyWord.date}` });
  }
  if (dailyWord.definition !== null && dailyWord.definition !== '') {
    embed.setDescription(`${dailyWord.definition}`);
  }

  return embed;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wordoftheday')
    .setDescription('Returns the current word of the day')
    .addStringOption((option) =>
      option
        .setName('date')
        .setDescription('The date of a specific Word of the Day (YYYY-mm-DD)')
        .setMinLength(10)
        .setMaxLength(10)
        .setRequired(false)
    ),
  async execute(interaction) {
    try {
      const date = interaction.options.getString('date');
      const dailyWord = await getDailyWord(date);
      const replyMsg = buildEmbed(dailyWord);
      if (replyMsg !== null) {
        return interaction.reply({ embeds: [replyMsg] });
      } else {
        return interaction.reply(
          'Ensure the date is of the format YYYY-mm-DD or try a more recent date.'
        );
      }
    } catch (error) {
      console.error(error);
      return interaction.reply('An error has occurred. Find your own word.');
    }
  },
};
