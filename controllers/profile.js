// ---(with basic postrgesql & created [dataBase] app.post('/register'))---------------------------------------------------------------------+++
// app.post('/register', (req, res)=> {
//     const { name, email, password} = req.body;
    // ------------------------------------------------------------------------+++
    // db('users')
    // // important methoth to return, instead of doing another select statement and grabing (new user).
    // .returning('*')
    // .insert({
    //     email: email,
    //     name: name,
    //     joined: new Date()
    // })
    // .then(user => {
    //     res.json(user[0]);
    // })
    // // important ! do not return json(err) because it will breach security issues with email...
    // .catch(err => res.status(400).json('Unable to register'))
    // ------------------------------------------------------------------------+++
    // database.users.push({
    //     id: '125',
    //     name: name,
    //     email: email,
    //     // do not return password!
    //     // password: password,
    //     entries: 0,
    //     joined: new Date()
    // })

    // res.json(database.users[database.users.length-1])
    // })

const handleProfileGet = (req, res, db)=> {
    const { id } = req.params;
    // let found = false;
    db.select('*').from('users')
    .where({
        id: id
    })
    .then(user => {
        // because returning an empty array [] when finding user is technically =TRUE ([]) we dont want to have a unknown user swerming around! so we use (user.length)...
        if(user.length){
            res.json(user[0])
        }else{
            res.status(400).json('Not found!')
        }
    })
    // ------------------------------------------------------------------------+++
    // database.users.forEach(user => {
    //     if (user.id === id) {
    //         found = true;
    //         return res.json(user);
    //     } 
    // })

    // if (!found){
    //     res.status(400).json('not found');
    // }
    // ------------------------------------------------------------------------+++
    .catch(err => res.status(400).json('Error getting user'))

}

module.exports = {
    // dont need de-value
    handleProfileGet
   };
// export default handleProfileGet;