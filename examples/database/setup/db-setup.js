import { createReadStream } from 'fs';
import csv from 'csv-parser';
import sqlite from 'better-sqlite3';

const SNACKBOT_DB = sqlite('../../../database/snackbot.db');

SNACKBOT_DB.exec(`
  CREATE TABLE IF NOT EXISTS Snacks (
    Name TEXT,
    Origin TEXT,
    Description TEXT,
    WikiUrl TEXT,
    ImageUrl TEXT)
`);

const stmt = SNACKBOT_DB.prepare(`
  INSERT INTO Snacks (Name, Origin, Description, WikiUrl, ImageUrl)
  VALUES (@Name, @Origin, @Description, @WikiUrl, @ImageUrl)
`);

createReadStream('./snacks.csv')
  .pipe(csv())
  .on('data', (data) => {
    stmt.run(data);
  });
