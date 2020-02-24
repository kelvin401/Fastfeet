import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/User';

import authConfig from '../../config/auth';

export default {
  async loggedIn(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ error: 'Token not provided' });
    }

    const [, token] = authHeader.split(' ');

    try {
      const decoded = await promisify(jwt.verify)(token, authConfig.secret);

      req.userId = decoded.id;

      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Token invalid' });
    }
  },

  async checkAdministrator(req, res, next) {
    const checkAdmin = await User.findByPk(req.userId);

    if (!checkAdmin.administrator) {
      return res
        .status(401)
        .json({ error: 'Administrator permission required.' });
    }
    return next();
  },
};
