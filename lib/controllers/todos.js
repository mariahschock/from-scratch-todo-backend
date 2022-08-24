const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
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
  });
