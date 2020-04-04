require('../src/db/mongoose');
const Task = require('../src/models/task');

Task.findByIdAndDelete('5e612bfaeec23c42b00b8889')
  .then(task => {
    return Task.countDocuments({
      completed: false  
    })
  })
  .then(result => console.log(result))
  .catch(e => console.log(e))