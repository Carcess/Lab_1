const express = require('express');
const mongoose = require('mongoose');
const app = express();

const env = require('dotenv');

env.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

mongoose.connection.on('connected', function () {
    console.log('Mongodb connected');
});




// Render HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');

});

app.listen(3000, () => console.log('Server running on port 3000'));

