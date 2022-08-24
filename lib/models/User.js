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

  static async getById(id) {
    console.log('id: ', id);
    const { rows } = await pool.query(`
    SELECT * FROM users
    WHERE id=$1`,
    [id]
    );
    console.log('rows: ', rows);
    return new User(rows[0]);
  }

  async getAllTasksByUser() {
    const { rows } = await pool.query(`
    SELECT tasks.* FROM tasks 
    INNER JOIN users ON user_id = tasks.user_id 
    WHERE users.id=$1`,
    [this.id]
    );
    this.tasks = rows;
    return this;
  }

  get passwordHash() {
    return this.#passwordHash;
  }
};
