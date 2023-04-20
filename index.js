const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();


// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
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
    artist: String,
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
    await Album.find({ title: req.params.title })
        .then((albums, error) => {
            if (albums) {
                res.status(200).json(albums);
            } else {
                res.status(404).json({ message: error })
            }
        })
        .catch(err => res.status(404).json({ message: err }));
});

// Create a new album
app.post('/api/albums', async (req, res) => {
    try {
        // Check if data already exists in the collection
        const existingData = await Album.findOne({ title: req.body.title });
        if (existingData) {
          // If data exists, return it
          res.status(409).json(existingData);
        } else {
          // If data doesn't exist, save it in the collection
          const newData = new Album(req.body);
          await newData.save();
          res.status(201).json(newData);
        }
      } catch (error) {
        // Handle any errors
        res.status(500).json({ error: error.message });
      }
});

// Update a album
app.put('/api/albums/:id', async (req, res) => {
    
    try {
        // Check if data already exists in the collection
        const existingData = await Album.findOne({ _id: req.params.id });
        if (!existingData) {
          // If data exists, return it
          res.status(404).json(existingData);
        } else {
          Album.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            artist: req.body.artist,
            year: req.body.year
          })
          .then(album => res.status(200).json(album))
        }
      } catch (error) {
        // Handle any errors
        res.status(500).json({ error: error.message });
      }
});

// Delete a album
app.delete('/api/albums/:id', async (req, res) => {
    try {
        // Check if data already exists in the collection
        const existingData = await Album.findOne({ _id: req.params.id });
        if (!existingData) {
          // If data exists, return it
          res.status(404).json("not found");
        } else {
          Album.findByIdAndRemove(req.params.id)
          .then(album => res.json("deleted"))
        }
      } catch (error) {
        // Handle any errors
        res.status(500).json({ error: error.message });
      }
});

app.listen(process.env.PORT, () => console.log('Server running on port ' + process.env.PORT));

