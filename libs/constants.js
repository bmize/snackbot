const path = require('path');

const PROJECT_ROOT = path.join(__dirname, '..');
const SNACKBOT_DB_PATH = path.join(PROJECT_ROOT, 'database', 'snackbot.db');

module.exports = {
  PROJECT_ROOT,
  SNACKBOT_DB_PATH,
};
