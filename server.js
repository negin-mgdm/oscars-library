const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'homepage.html'));
});

app.get('/data', (req, res) => {
    fs.readFile("oscars.json", 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading the data file.');
            return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
