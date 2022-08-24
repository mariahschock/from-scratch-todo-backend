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

  async getAllTasks() {
    const { rows } = pool.query(`
    SELECT tasks.* FROM tasks 
    INNER JOIN users ON user_id = tasks.user_id 
    WHERE users.id=$1`,
    [this.id]
    );
    this.tasks = rows;
    return this;
  }
};
