// Calling Dependencies //
const express = require('express');
const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');
// Calling Express and setting up Port access //
const app = express();
const PORT = process.env.PORT || 3001;
// Express middleware functions //
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Routes to HTML pages and Database //

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// Function to write new notes and specify ID utilizing Uniqid //
app.post('/api/notes', (req, res) => {
    let note = req.body;
    let list = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));

    note.id = uniqid();
    list.push(note);
    
    fs.writeFileSync('./db/db.json', JSON.stringify(list));
    res.json(list);
});

// Function to delete notes based on ID //
app.delete('/api/notes/:id', (req, res) => {
    let list = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
    let noteId = (req.params.id).toString();

    list = list.filter(selected => {
        return selected.id != noteId;
    });

    fs.writeFileSync('./db/db.json', JSON.stringify(list));
    res.json(list);
})

// Set listening Port //
app.listen(PORT, () => console.log("Server listening at Port " + PORT));

