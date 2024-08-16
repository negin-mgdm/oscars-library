const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const app = express();
const port = process.env.PORT || 8000;

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
        return data.filter((nomination) => nomination.Won.toLowerCase() === won);
    } else {
        return data;
    }
}

async function filterByInputs(query) {
    const data = await readOscarsJson();

    const { year = "", category = "", info = "", won = "" } = query;
    const filterDataByWon = filterByWonInput(data, won);

    return filterDataByWon.filter((nomination) => {
        const infoData = typeof nomination.Info === 'string' ? nomination.Info.toLowerCase() : '';
        return (
            nomination.Year.toLowerCase().includes(year.toLowerCase()) &&
            nomination.Category.toLowerCase().includes(category.toLowerCase()) &&
            infoData.includes(info.toLowerCase())
        );
    });
}

app.get('/getNominees', async (req, res) => {
    const filteredData = await filteredNomineesInput(req.query);
    res.send(filteredData);
});

async function filteredNomineesInput(query) {
    const data = await readOscarsJson();
    const { nominee = "", won = "" } = query;

    const filterByWon = filterByWonInput(data, won);

    let filteredData = filterByWon.filter((nomination) => {
        return (
            (nomination.Category.toLowerCase().includes("actress") ||
                nomination.Category.toLowerCase().includes("actor")) &&
            nomination.Nominee.toLowerCase().includes(nominee.toLowerCase())
        );
    });

    let nomineeCount = {};
    filteredData.forEach(nominee => {
        nomineeCount[nominee.Nominee] = (nomineeCount[nominee.Nominee] || 0) + 1;
    });

    const keyValuePairs = Object.entries(nomineeCount)
        .map(([key, value]) => ({ key, value }))
        .sort((a, b) => b.value - a.value);

    return keyValuePairs;
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
