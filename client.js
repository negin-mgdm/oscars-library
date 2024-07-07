// Group A
main();

function main() {
    document
        .getElementById("getNominations")
        .addEventListener("click", getNominations);

    document
        .getElementById("getNominees")
        .addEventListener("click", getNominees);
}

// Group B
async function getNominations() {
    // Fetch nominations from server and display in output area
    clearOutput();
    const data = await fetchOscarsData();
    const filteredData = filterByInputs(data);
    displayingNominationsResults(filteredData);
}

function displayingNominationsResults(filteredData) {
    showTotalResults(filteredData);
    addNominationsTable(filteredData);
}

function addNominationsTable(data) {
    let nominations = "";
    data.forEach((nominee) => {
        let nomination = `
  <tr>
    <td>${nominee.Year}</td>
    <td>${nominee.Category}</td>
    <td>${nominee.Nominee}</td>
    <td>${nominee.Info}</td>
    <td>${nominee.Won}</td>
    </tr>
    `;
        nominations += nomination;
    });
    const header =
        '<thead class="thead-dark"><tr><th>Year</th><th>Category</th><th>Nominee</th><th>Info</th><th>Won?</th></tr></thead>';
    let table = `<table class="table table-striped">${header}<tbody>${nominations}</tbody></table>`;

    const nomineeDiv = document.createElement("div");
    nomineeDiv.innerHTML = table;

    const outputDiv = document.getElementById("output");
    outputDiv.appendChild(nomineeDiv);
}

function filterByInputs(data) {
    const filterDataByWon = filterByWonInput(data);
    let filteredData = filterDataByWon.filter((nomination) => {
        const info = typeof nomination.Info === 'string' ? nomination.Info.toLowerCase() : '';
        if (
            nomination.Year.toLowerCase().includes(getInputValue("year")) &&
            nomination.Nominee.toLowerCase().includes(getInputValue("nominee")) &&
            nomination.Category.toLowerCase().includes(getInputValue("category")) &&
            info.includes(getInputValue("info"))
        ) {
            return true;
        } else {
            return false;
        }
    });
    return filteredData;
}

// Group C
async function getNominees() {
    // Fetch nominees from server and display in output area
    clearOutput();
    const data = await fetchOscarsData();
    let result = countNominationsForNominees(data);
    displayingNomineesResults(result);
}

function displayingNomineesResults(result) {
    showTotalResults(result);
    addNomineeTable(result);
}

function addNomineeTable(result) {
    let nominees = "";
    result.forEach((x) => {
        let y = `
<tr>
  <td>${x.key}</td>
  <td>${x.value}</td>
</tr>
`;
        nominees += y;
    });

    const header =
        '<thead class="thead-dark"><tr><th>Nominee</th><th>Number of times</th></tr></thead>';
    let table = `<table class="table table-striped">${header}<tbody>${nominees}</tbody></table>`;

    const nomineeDiv = document.createElement("div");
    nomineeDiv.innerHTML = table;

    const outputDiv = document.getElementById("output");
    outputDiv.appendChild(nomineeDiv);
}

function countNominationsForNominees(data) {
    const filterByWon = filterByWonInput(data);
    let filteredData = filterByWon.filter((nomination) => {
        if (
            nomination.Category.includes("Actress") ||
            nomination.Category.includes("Actor")
        ) {
            return true;
        } else {
            return false;
        }
    });

    let nomineeCount = {};
    for (let nominee of filteredData) {
        if (nominee.Nominee in nomineeCount) {
            nomineeCount[nominee.Nominee] += 1;
        } else {
            nomineeCount[nominee.Nominee] = 1;
        }
    }
    const keyValuePairs = Object.entries(nomineeCount)
        .map(([key, value]) => ({ key, value }))
        .sort((a, b) => b.value - a.value);

    const filterByNominationsCountInput = filterNomineeNominationsCountByValue(keyValuePairs);

    return filterByNominationsCountInput;
}

function filterNomineeNominationsCountByValue(data) {
    const input = getInputValue("non");
    if (input == "") {
        return data;
    } else {
        let filterData = data.filter((x) => {
            return x.value == parseInt(input);
        });
        return filterData;
    }
}

// Group D
async function fetchOscarsData() {
    const response = await fetch("oscars.json");
    const data = await response.json();
    return data;
}

function getInputValue(id) {
    return document.getElementById(id).value.toLowerCase();
}

function filterByWonInput(data) {
    const won = getInputValue("won");
    if (won == "yes" || won == "no") {
        let filteredNominations = data.filter((nomination) => {
            return nomination.Won.includes(won);
        })
        return filteredNominations;
    } else {
        return data;
    }
}

function clearInput() {
    // Clear all input fields
    document.getElementById("oscar-form").reset();
}

function clearOutput() {
    // Clear output area
    document.getElementById("output").innerText = "";
}

function getResultsCount(tableData) {
    return tableData.length;
}

function showTotalResults(filteredData) {
    const count = getResultsCount(filteredData);

    const resultsElement = document.createElement("p");
    resultsElement.innerHTML = "Total Results: " + count;
    resultsElement.className = "h5";

    const outputDiv = document.getElementById("output");
    outputDiv.appendChild(resultsElement);
}