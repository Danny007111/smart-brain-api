const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    // -------------(Security review)----------------------------------
    if(!email || !name || !password){
      return res.status(400).json('incorrect form submition');
    }
    // -----------------------------------------------
    const hash = bcrypt.hashSync(password);
      db.transaction(trx => {
        trx.insert({
          hash: hash,
          email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
              // knex.js version 1.0.0 or higher: loginEmail[0].email --> this now returns the email. (loginEmail[0] --> this now returns a json) 
              email: loginEmail[0].email,
              name: name,
              joined: new Date()
            })
            .then(user => {
              res.json(user[0]);
            })
        }) 
        .then(trx.commit)
        .catch(trx.rollback)
      })
      .catch(err => res.status(400).json('unable to register'))
}

// ---Code review, exporting each CRUD function---------------------------------------------------------------------
module.exports = {
    handleRegister: handleRegister   
   };
// ------------------------------------------------------------------------
// After node-fetch rep installed...
// export default handleRegister;