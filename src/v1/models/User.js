const db = require('../utils/db');

class User {
  static async create(username, hashedPassword) {
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    const [result] = await db.query(query, [username, hashedPassword]);
    return result.insertId;
  }

  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = ?';
    const [rows] = await db.query(query, [username]);
    return rows[0];
  }

  static async findAll() {
    const query = 'SELECT * FROM users';
    const [rows] = await db.query(query);
    return rows;
  }
}

module.exports = User;
