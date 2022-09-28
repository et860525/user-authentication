import sqlite3 from 'sqlite3';
import crypto from 'crypto';

const mkdirp = require('mkdirp');

mkdirp.sync('./data');

var db = new sqlite3.Database('./data/books.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users ( 
		id INTEGER PRIMARY KEY, 
		username TEXT UNIQUE, 
		hashed_password BLOB, 
		salt BLOB,
		name TEXT, 
		email TEXT UNIQUE, 
		email_verified INTEGER
	);`);

  db.run(`CREATE TABLE IF NOT EXISTS Books (
		Book_ID INTEGER PRIMARY KEY AUTOINCREMENT,
		Title VARCHAR(100) NOT NULL,
		Author VARCHAR(100) NOT NULL,
		Comments TEXT
	);`);

  db.run(`INSERT OR IGNORE INTO Books (Book_ID, Title, Author, Comments) VALUES
  (1, 'Mrs. Bridge', 'Evan S. Connell', 'First in the serie'),
  (2, 'Mr. Bridge', 'Evan S. Connell', 'Second in the serie'),
  (3, 'L''ingénue libertine', 'Colette', 'Minne + Les égarements de Minne');`);

  const salt = crypto.randomBytes(16);
  db.run('INSERT OR IGNORE INTO users (username, hashed_password, salt) VALUES (?, ?, ?)', [
    'mango',
    crypto.pbkdf2Sync('letmein', salt, 310000, 32, 'sha256'),
    salt,
  ]);
});

export default db;
