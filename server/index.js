require('dotenv').config();
const treasureCtrl = require('./controllers/treasureController');
const auth = require('./middleware/authMiddleware');


const express = require('express'),
  session = require('express-session'),
  massive = require('massive'),
  app = express(),
  { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env,
  PORT = 4000,
  authCtrl = require('./controllers/authController');

app.use(express.json())
app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: SESSION_SECRET,
}))

massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
}).then(db => {
  app.set('db', db);
  console.log(`Db is connected!`)
})

app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure);
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)


app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))