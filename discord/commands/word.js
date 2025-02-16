import { DateTime } from 'luxon';
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { load } from 'cheerio';

import { isBlank } from '../../libs/string-utils.js';
import { isNil } from '../../libs/object-utils.js';

// Regex for a date in YYYY-mm-DD format from 1900-01-01 through 2099-12-31
const DATE_REGEX = /^(19|20)\d\d-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
let WORD_OF_THE_DAY = null;

/**
 *
 * @param {string} date
 * @returns {boolean} true if the date is in ISO format (yyyy-MM-dd)
 */
function isISODate(date) {
  return DATE_REGEX.test(date);
}

/**
 *
 * @param {string} date
 * @returns {Promise<DailyWord>}
 */
async function fetchNewWord(date) {
  try {
    if (isBlank(date)) {
      date = DateTime.now({ zone: 'America/New_York' }).toFormat('yyyy-MM-dd');
    } else if (!isISODate(date)) {
      return null;
    }

    const response = await fetch(`https://www.merriam-webster.com/word-of-the-day/${date}`);
    const body = await response.text();
    const $ = load(body);
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
 * @typedef {{ date: string, word: string, definition: string }} DailyWord
 * @param {string} date
 * @returns {Promise<DailyWord>}
 */
async function getDailyWord(date) {
  try {
    if (isBlank(date)) {
      date = DateTime.now({ zone: 'America/New_York' }).toFormat('yyyy-MM-dd');
    } else if (!isISODate(date)) {
      return null;
    }

    const today = DateTime.now({ zone: 'America/New_York' }).toFormat('yyyy-MM-dd');
    if (date === today && WORD_OF_THE_DAY?.date === today) {
      return WORD_OF_THE_DAY;
    }

    const dailyWord = await fetchNewWord(date);
    if (date === today) {
      WORD_OF_THE_DAY = dailyWord;
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
  if (!isBlank(dailyWord?.word)) {
    const embed = new EmbedBuilder().setColor(0xffc170).setTitle(dailyWord.word);

    if (!isBlank(dailyWord.date)) {
      embed.setFields({ name: 'Date', value: `${dailyWord.date}` });
    }
    if (!isBlank(dailyWord.definition)) {
      embed.setDescription(`${dailyWord.definition}`);
    }

    return embed;
  }
}

export const command = {
  data: new SlashCommandBuilder()
    .setName('wordoftheday')
    .setDescription('Returns the current word of the day')
    .addStringOption((option) =>
      option
        .setName('date')
        .setDescription('The date of a specific Word of the Day (YYYY-mm-DD)')
        .setMinLength(10)
        .setMaxLength(10)
        .setRequired(false),
    ),
  async execute(interaction) {
    try {
      const date = interaction.options.getString('date');
      const dailyWord = await getDailyWord(date);
      const replyMsg = buildEmbed(dailyWord);
      if (!isNil(replyMsg)) {
        return interaction.reply({ embeds: [replyMsg] });
      } else {
        return interaction.reply('Ensure the date is of the format YYYY-mm-DD or try a more recent date.');
      }
    } catch (error) {
      console.error(error);
      return interaction.reply('An error has occurred. Find your own word.');
    }
  },
};
