const express = require('express');
const mongoose = require('mongoose');
const app = express();

const env = require('dotenv');
env.config();
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser: true});

mongoose.connection.on('connected', function () {  
    console.log('Mongodb connected');
  }); 
  

app.listen(3000, () => console.log('Server running on port 3000'));

