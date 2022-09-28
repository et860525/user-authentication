import { Request, Response, NextFunction } from 'express';
import express from 'express';
import passport from 'passport';
import local from 'passport-local';
import crypto from 'crypto';
import db from '../db';

var router = express.Router();

passport.use(
  new local.Strategy(function verify(username: any, password: any, done: any) {
    db.get('SELECT * FROM users WHERE username = ?', [username], function (err: any, user: any) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password.' });
      }

      crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
        if (err) {
          return done(err);
        }
        if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
          return done(null, false, { message: 'Incorrect username or password.' });
        }
        return done(null, user);
      });
    });
  })
);

passport.serializeUser(function (user: any, done) {
  process.nextTick(function () {
    done(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user: any, done) {
  process.nextTick(function () {
    return done(null, user);
  });
});

router.get('/login', function (req: Request, res: Response, next: NextFunction) {
  res.render('login');
});

router.post(
  '/login/password',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);

router.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
