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
    const filteredData = await filterByInputs();
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

async function filterByInputs() {
    const year = getInputValue("year");
    const nominee = getInputValue("nominee");
    const category = getInputValue("category");
    const info = getInputValue("info");
    const won = getInputValue("won");
    const queryParameters = `year=${year}&nominee=${nominee}&category=${category}&info=${info}&won=${won}`;
    const response = await fetch(`http://localhost:8080/getNominations?${queryParameters}`);
    const data = await response.json();
    return data;
}

// Group C
async function getNominees() {
    // Fetch nominees from server and display in output area
    clearOutput();
    let result = await filterNomineesByInput();
    displayingNomineesResults(result);
}

async function filterNomineesByInput() {
    const non = getInputValue("non");
    const won = getInputValue("won");
    const queryParameters = `non=${non}&won=${won}`;
    const response = await fetch(`http://localhost:8080/getNominees?${queryParameters}`);
    const data = await response.json();
    return data;
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

// Group D
async function fetchOscarsData() {
    const response = await fetch('http://localhost:8080/data');
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