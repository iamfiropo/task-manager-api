const express = require('express');

require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT;

/**
 * How to set up the server to respond to client request during maintenance or when the server is down
 * 
    app.use((req, res, next) => {
      res.status(503).send('Site is currently down. Check back soon!')
    })
 */

 /**
  * How to set up the server to disable some request method resources
  * 
    app.use((req, res, next) => {
      if(req.method === 'GET') {
        res.json('GET requests are disabled')
      } else {
        next()
      }
    })
  */

app.use(express.json());
app.use(userRouter, taskRouter);

app.listen(port, () => {
  console.log('Server is up on port ' + port);
})