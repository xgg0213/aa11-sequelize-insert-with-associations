// Instantiate Express and the application - DO NOT MODIFY
const express = require('express');
const app = express();

// Import environment variables in order to connect to database - DO NOT MODIFY
require('dotenv').config();
require('express-async-errors');

// Import the models used in these routes - DO NOT MODIFY
const { Band, Musician, Instrument, MusicianInstrument } = require('./db/models');

// Express using json - DO NOT MODIFY
app.use(express.json());


// STEP 1: Creating from an associated model (One-to-Many)
app.post('/bands/:bandId/musicians', async (req, res, next) => {
    // Your code here 
    const {bandId} = req.params;
    const {firstName, lastName} = req.body;
    const band = await Band.findByPk(bandId);

    const createdMusician = await band.createMusician({
        firstName: firstName,
        lastName: lastName,
    })

    return res.json({
        'message': "Created new musician for band The Falling Box.",
        createdMusician
    })
})

// STEP 2: Connecting two existing records (Many-to-Many)
app.post('/musicians/:musicianId/instruments', async (req, res, next) => {
    // Your code here 
    const {musicianId} = req.params;
    const {instrumentIds} = req.body;
    const musician = await Musician.findByPk(musicianId);

    let str = '';
    let newInstruments = [];

    instrumentIds.forEach(async(id) =>  {
        str+=id.toString()+',';
        const newId = await MusicianInstrument.create({
            instrumentId:id,
            musicianId: musicianId,
        });
        newInstruments.push()
    });


    //await musician.addInstruments(newInstruments)

    return res.json({
         "message": `Associated Adam with instruments ${str.slice(0,-1)}.`
    })

})


// Get the details of one band and associated musicians - DO NOT MODIFY
app.get('/bands/:bandId', async (req, res, next) => {
    const payload = await Band.findByPk(req.params.bandId, {
        include: { model: Musician },
        order: [[Musician, 'firstName']]
    });
    res.json(payload);
});

// Get the details all bands and associated musicians - DO NOT MODIFY
app.get('/bands', async (req, res, next) => {
    const payload = await Band.findAll({
        include: {model: Musician},
        order: [['name'], [Musician, 'firstName']]
    });
    res.json(payload);
});

// Get the details of one musician and associated instruments - DO NOT MODIFY
app.get('/musicians/:musicianId', async (req, res, next) => {
    const payload = await Musician.findByPk(req.params.musicianId, {
        include: {model: Instrument},
        order: [[Instrument, 'type']]
    });
    res.json(payload);
});

// Get the details all musicians and associated instruments - DO NOT MODIFY
app.get('/musicians', async (req, res, next) => {
    const payload = await Musician.findAll({
        include: { model: Instrument },
        order: [['firstName'], ['lastName'], [Instrument, 'type']]
    });
    res.json(payload);
});

// Root route - DO NOT MODIFY
app.get('/', (req, res) => {
    res.json({
        message: "API server is running"
    });
});

// Set port and listen for incoming requests - DO NOT MODIFY
if (require.main === module) {
    const port = 8000;
    app.listen(port, () => console.log('Server for Associations is listening on port', port));
  } else {
    module.exports = app;
  }
