const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Todo = require('../models/Todo');
const User = require('../models/User');

module.exports = Router()
  .get('/', authenticate, async (req, res, next) => {
    try {
      const data = await User.getById(req.user.id);
      await data.getAllTasksByUser();
      res.json(data);
    } catch (e) {
      next(e);
    }
  })

  .post('/', authenticate, async (req, res, next) => {
    try {
      console.log(req.body);
      const newTask = await Todo.insert({ ...req.body, user_id: req.user.id });
      res.json(newTask);
    } catch (e) {
      next(e);
    }
  });
