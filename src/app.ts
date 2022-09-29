import express, { Express } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import passport from 'passport';
import session from 'express-session';
var logger = require('morgan');
var SQLiteStore = require('connect-sqlite3')(session);

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../public')));

app.use(passport.initialize());
app.use(
  session({
    secret: 'keyboard mango',
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: 'sessions.db', dir: './data' }),
  })
);

/* Same result but passport.session() more succinctly  */
// app.use(passport.authenticate('session'));
app.use(passport.session());

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/', authRouter);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
