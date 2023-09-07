const express = require('express');
// --important hash password for security ---VVVVV
const bcrypt = require('bcrypt-nodejs'); 
const cors = require('cors');
// Conecting to DataBase ---V
const knex = require('knex');

// ---Code review, cleaning up code moving each function to controller folder---------------------------------------------------------------------
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// ------------------------------------------------------------------------

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'Dan97',
      database : 'smart-brain'
    }
  });

//   to show each user in db table 'users' but first make sure db is online connected and reload after npm start for it to work.
// db.select('*').from('users').then(data => {
//     console.log(data)
// })

const app = express();

// not using this created database no more! ----VVVVV
// const database = {
//     users: [
//         {
//             id: '123',
//             name: 'John',
//             email: 'john@gmail.com',
//             password: 'cookies',
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id: '124',
//             name: 'Sally',
//             email: 'sally@gmail.com',
//             password: 'bananas',
//             entries: 0,
//             joined: new Date()
//         }
//     ], 
//     login: [
//         {
//             id: "987",
//             hash: '',
//             email: 'john@gmail.com'
//         }
//     ]
// } We are now using KNEX (npm) package 

app.use(express.json())

app.use(cors())


// Database comp...VVVVV
// app.get('/', (req, res)=> {
//     res.send(database.users)
// })


app.post('/signin', (req, res) => {
    // Dependency injection!!!!!!!!  for handleSignin/Register to have db and bcrypt.!!!!!!!!!!!!!!!!!!!!!!
  signin.handleSignin(req, res, db, bcrypt)
})


app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})


// updated post
app.put('/image', (req, res) => {image.handleImage(req, res, db)})

// -----DID NOT COMPLETE---------------------(Adding security key -Changing CLarifai api to back-end to keep it safe- )----------------------------------------------+++
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

// ------------------------------------------------------------------------+++


//----------------------bcrypt-------------------------(password protection)

// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3000, () => {
    console.log('app is running on port 3000')
})

/*
/ --> res = this is working
/signin --> POST = success / fail   USE POST BECAUSE WE -----> Dont send password as query string due to security! (sending inside body -HTTPS-) -----
/register --> POST = (return) user
/profile/:(optional)userID --> GET = user
/image --> PUT = user count how many entries.
*/

