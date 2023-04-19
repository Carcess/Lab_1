const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();


// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const env = require('dotenv');

env.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

mongoose.connection.on('connected', function () {
    console.log('Mongodb connected');
});

// Define a schema
const albumSchema = new mongoose.Schema({
    title: String,
    artist : String,
    year: Number
});

// Define a model
const Album = mongoose.model('Album', albumSchema);


// Render HTML file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');

});


// Get all albums
app.get('/api/albums', (req, res) => {
    Album.find()
      .then(albums => {
        res.json(albums);
      })
      .catch(err => console.log(err));
  });


// Get album by title
app.get('/api/albums/:title', async (req, res) => {
    
        await Album.find({title:req.params.title})
      .then((albums,error)=> {
        if(albums){
            res.status(200).json(albums);
        }else{
            res.status(404).json({message:error})
        }
        
      })
      .catch(err => res.status(404).json({message:err}));
    
    
  });

app.listen(3000, () => console.log('Server running on port 3000'));

