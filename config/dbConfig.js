const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGO_URL );

// const connection = mongoose.connection;

// connection.on('connected' , () => {
//     console.log('MongoDB is connected')
// })


// connection.on('error' , (error) => {
//     console.log("Error in the MongoDB connection" , error)
// })

const uri = process.env.MONGO_URL

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error.message);
  });


module.exports = mongoose;