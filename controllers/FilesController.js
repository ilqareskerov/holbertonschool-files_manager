const User = require('../models/User');
const File = require('../models/File');
const jwt = require('jsonwebtoken');

class FilesController {
  static async getShow(req, res) {
    try {
      const token = req.headers['authorization'];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const decoded = jwt.verify(token, 'your_jwt_secret');
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const file = await File.findOne({ _id: req.params.id, userId: user._id });
      if (!file) {
        return res.status(404).json({ error: 'Not found' });
      }

      return res.json(file);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getIndex(req, res) {
    try {
      const token = req.headers['authorization'];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const decoded = jwt.verify(token, 'your_jwt_secret');
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { parentId = 0, page = 0 } = req.query;
      const files = await File.find({ userId: user._id, parentId })
        .skip(page * 20)
        .limit(20);

      return res.json(files);
    } catch (error) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = FilesController;
