const Todo = require('../models/Todo');

module.exports = async (req, res, next) => {
  try {
    const task = await Todo.getTaskById(req.params.id);
    if (req.user.id !== task.userId)
      throw new Error('Lol, you thought!');
  
    next();
  } catch (err) {
    err.status = 403;
    next(err);
  }
};
