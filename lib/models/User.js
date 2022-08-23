const pool = require('../utils/pool');

module.exports = class User {
  id;
  email;
  #passwordHash;
  firstName;
  lastName;

  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.#passwordHash = row.password_hash;
    this.firstName = row.first_name;
    this.lastName = row.last_name;
  }

  static async insert({ email, passwordHash, firstName, lastName }) {
    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, first_name, last_name)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [email, passwordHash, firstName, lastName]
    );
    return new User(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM users');
    return rows.map((row) => new User(row));
  }

  static async getByEmail(email) {
    const { rows } = await pool.query(
      `
      
      SELECT * FROM users
      WHERE email=$1
      `,
      [email]
    );
    if (!rows[0]) return null;
    return new User(rows[0]);
  }

  get passwordHash() {
    return this.#passwordHash;
  }
};
