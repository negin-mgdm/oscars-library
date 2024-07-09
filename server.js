const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const port = 8080;

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'homepage.html'));
});

app.get('/data', async (req, res) => {
    try {
        const data = await fs.readFile("oscars.json", 'utf8');
        res.setHeader('Content-Type', 'application/json');
        res.send(data);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error reading the data file.');
    }
});

app.get('/getNominations', async (req, res) => {
    const filteredData = await filterByInputs(req.query);
    res.send(filteredData);
});

async function readOscarsJson() {
    const filePath = path.join(__dirname, 'oscars.json');
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error parsing the file:', error);
        throw error;
    }
};

function filterByWonInput(data, won) {
    if (won == "yes" || won == "no") {
        let filteredNominations = data.filter((nomination) => {
            return nomination.Won.includes(won);
        })
        return filteredNominations;
    } else {
        return data;
    }
}

async function filterByInputs(query) {
    const data = await readOscarsJson();

    const { year, nominee, category, info, won } = query;
    const filterDataByWon = filterByWonInput(data, won);

    let filteredData = filterDataByWon.filter((nomination) => {
        const infoData = typeof nomination.Info === 'string' ? nomination.Info.toLowerCase() : '';
        if (
            nomination.Year.toLowerCase().includes(year) &&
            nomination.Nominee.toLowerCase().includes(nominee) &&
            nomination.Category.toLowerCase().includes(category) &&
            infoData.includes(info)
        ) {
            return true;
        } else {
            return false;
        }
    });
    return filteredData;
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
