const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const dotenv = require('dotenv');
const db = require('./db');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' })); // Increase body size limit if needed
app.use(express.urlencoded({ extended: true }));
const port = 5000;

const sessionStore = new MySQLStore({}, db.promise());
//app.set('trust proxy', 1); // Trust first proxy (for Heroku or similar environments)
//app.disable('x-powered-by'); // Disable 'X-Powered-By' header for security

app.use(cors({
  origin: 'https://vaultguard-oa58.onrender.com', // adjust for your frontend
  credentials: true,
}));
app.use(session({
  key: 'user_sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 20, // 1 day
    httpOnly: true,
    secure: true, // set to true if using https   
    sameSite: 'lax', // adjust based on your needs
  },
}));


app.post('/register', (req, res) => {
  const { name,auth, password,status } = req.body;
  const query = 'INSERT INTO website (name, auth,password,status) VALUES (?, ?,?,?)';
  db.query(query, [name,auth, password,status], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json({ message: 'Data Added Successfully' });
  });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM user WHERE username = ?';
  db.query(query, [username], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length > 0) {
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        req.session.user = user;
        res.status(200).json({ message: 'Logged in' });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

app.get('/session', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('user_sid'); // Clear session cookie
  res.status(200).json({ message: 'Logged out' });
});

// API endpoint to get all registered users (for display)
app.get('/data', (req, res) => {
  const query = 'SELECT * FROM website';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.status(200).json(results);
  });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
