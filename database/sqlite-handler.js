const sqlite = require('better-sqlite3');

class SQLiteHandler {
  /**
   * @param {string} dbFileName The database file
   */
  constructor(dbFileName) {
    this.db = sqlite(dbFileName);
    console.log(`Connected to the ${dbFileName} database.`);
  }

  /**
   * @param {string} sql The SQL query string
   * @param {*[]} params The list of SQL params
   */
  async runQuery(sql, params = []) {
    const stmt = this.db.prepare(sql);
    stmt.run(params);
    return stmt;
  }

  /**
   * @param {string} sql The SQL query string
   * @param {*[]} params The list of SQL params
   */
  async get(sql, params = []) {
    const stmt = this.db.prepare(sql);
    return stmt.get(params);
  }

  /**
   * @param {string} sql The SQL query string
   * @param {*[]} params The list of SQL params
   */
  async all(sql, params = []) {
    const stmt = this.db.prepare(sql);
    return stmt.all(params);
  }

  async close() {
    this.db.close();
    console.log('Closing the database connection.');
  }
}

module.exports = SQLiteHandler;
