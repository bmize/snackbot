import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const SNACKBOT_DB_PATH = join(PROJECT_ROOT, 'database', 'snackbot.db');
