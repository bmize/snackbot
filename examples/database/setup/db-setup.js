const sqlite = require('better-sqlite3');
const fs = require('fs');
const csv = require('csv-parser');

const db = sqlite('../../../database/snackbot.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS Snacks (
    Name TEXT,
    Origin TEXT,
    Description TEXT,
    WikiUrl TEXT,
    ImageUrl TEXT)
`);

const stmt = db.prepare(`
  INSERT INTO Snacks (Name, Origin, Description, WikiUrl, ImageUrl)
  VALUES (@Name, @Origin, @Description, @WikiUrl, @ImageUrl)
`);

fs.createReadStream('./snacks.csv')
  .pipe(csv())
  .on('data', (data) => {
    stmt.run(data);
  });
