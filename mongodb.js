const { MongoClient, ObjectID } = require('mongodb');

const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(
  connectionURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  (error, client) => {
    if (error) return console.log("Unable to connect to the database!");

    const db = client.db(databaseName);

    // db.collection('users').findOne({ name: 'Ropo'}, (error, user) => {
    //   if(error || user === null || user === undefined) return console.log('Unable to fetch user')

    //   console.log(user)
    // })

    // db.collection('users').find({ age: 28 }).count( (error, count) => {
    //   console.log(count)
    // })

    // db.collection('tasks').findOne({ _id: new ObjectID("5e5be025e7ec77fce00a69ce") }, (error, result) => {
    //   if(error) return console.log('Unable to fetch user');

    //   console.log(result)
    // })

    // db.collection('tasks').find({ completed: false }).toArray((error, task) => {
    //   console.log(task)
    // })

    // db.collection('users').updateOne({ _id: new ObjectID('5e5bd81d882f1cfcb50995cd')}, {
    //   $set: {
    //     name: 'Josh'
    //   }
    // }).then(result => console.log(result.matchedCount)
    // ).catch(error => console.log(error))

    // db.collection('tasks').updateMany({ completed: true, }, {
    //   $set: { completed: false }
    // }).then(result => console.log(result.modifiedCount)
    // ).catch(error => console.log(error))

    // db.collection('users').deleteMany({ name: 'Josh'})
    //   .then(result => console.log(result.deletedCount))
    //   .catch(error => console.log(error))

    db.collection('tasks').deleteOne({ _id: new ObjectID('5e5be025e7ec77fce00a69cc')})
      .then(result => console.log(result.deletedCount))
      .catch(error => console.log(error))

  }
);
