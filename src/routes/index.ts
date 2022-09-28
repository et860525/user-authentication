import express, { Request, Response } from 'express';
import db from '../db';

const router = express.Router();

/* GET home page. */
router.get(
  '/',
  function (req, res, next) {
    if (!req.user) {
      return res.render('home');
    }
    next();
  },
  function (req, res, next) {
    res.render('index', { user: req.user });
  }
);

router.get('/books', (req: Request, res: Response) => {
  const sql = 'SELECT * FROM Books ORDER BY Title';
  db.all(sql, [], (err: any, rows: any) => {
    if (err) {
      return console.error(err.message);
    }
    res.send({ model: rows });
  });
});

module.exports = router;
