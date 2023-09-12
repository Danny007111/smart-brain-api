// ---(with created [dataBase] app.post('/signin'))---------------------------------------------------------------------+++

// app.post('/signin', (req, res)=> {
//     //1. We need a database to match password when trying to sign in. We are only accessing first user but we should be looping threw database!
//     if(req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
//         // res.json('success');---->>>just a success message!

//         //  VVV--- We are now returning a real user from our "mock" database.---VVV --- to make signin.js work!
//         res.json(database.users[0]);
//     }else{
//         res.status(400).json('error logging in');
//     }
    
// })

    // ------------------------------------------------------------------------+++

const handleSignin = (req, res, db, bcrypt)=> {
  // -------------(Security review)----------------------------------
  const { email, password } = req.body;
    if(!email || !password){
      return res.status(400).json('incorrect form submition');
    }
  // -----------------------------------------------
    db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials1')
      }
    })
    .catch(err => res.status(400).json('wrong credentials2'))
}

// ---Code review, exporting each CRUD function---------------------------------------------------------------------
module.exports = {
    handleSignin: handleSignin
   };
   // ------------------------------------------------------------------------
// export default handleSignin;