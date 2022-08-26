const pool = require('../utils/pool');

module.exports = class Todo {
  id;
  task;
  completed;
  userId;

  constructor(row) {
    this.id = row.id;
    this.task = row.task;
    this.completed = row.completed;
    this.userId = row.user_id;
  }

  static async insert(newTask) {
    const { rows } = await pool.query(
      `INSERT INTO tasks (task, completed, user_id)
       VALUES ($1, $2, $3)
       RETURNING *`, [newTask.task, newTask.completed, newTask.user_id]
    );
    return new Todo(rows[0]);
  }

  static async getTaskById(id) {
    const { rows } = await pool.query(
      `SELECT * from tasks
      WHERE id=$1`, [id]
    );
    return new Todo(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `DELETE from tasks
    WHERE id=$1
    RETURNING *`, [id]
    );
    return new Todo(rows[0]);
  }
};
