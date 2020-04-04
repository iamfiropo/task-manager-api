require('../src/db/mongoose');
const User = require('../src/models/user');

User.findByIdAndUpdate('5e615a8d8480ce45cdde4364', { age: 1 })
  .then(user => {
    console.log(user)
    return User.countDocuments({
      age: 1
    })
  })
  .then(result => console.log(result))
  .catch(e => console.log(e))