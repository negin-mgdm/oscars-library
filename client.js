main();

function main() {
    document.getElementById("getNominations").addEventListener("click", getNominations);
    document.getElementById("getNominees").addEventListener("click", getNominees);
    document.getElementById("clearNominationsInput").addEventListener("click", () => clearInput("nominations-form"));
    document.getElementById("clearNomineesInput").addEventListener("click", () => clearInput("nominees-form"));
    document.getElementById("clearNominationsOutput").addEventListener("click", clearOutput);
    document.getElementById("clearNomineesOutput").addEventListener("click", clearOutput);
}

async function getNominations() {
    clearOutput();
    const filteredData = await filterNominationsByInputs();
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
        </tr>`;
        nominations += nomination;
    });
    const header = '<thead class="thead-dark"><tr><th>Year</th><th>Category</th><th>Nominee</th><th>Info</th><th>Won?</th></tr></thead>';
    let table = `<table class="table table-striped">${header}<tbody>${nominations}</tbody></table>`;

    const nomineeDiv = document.createElement("div");
    nomineeDiv.innerHTML = table;

    const outputDiv = document.getElementById("output");
    outputDiv.appendChild(nomineeDiv);
}

async function filterNominationsByInputs() {
    const year = getInputValue("nominations-year");
    const category = getInputValue("nominations-category");
    const info = getInputValue("nominations-info");
    const won = getInputValue("nominations-won");
    const queryParameters = `year=${year}&category=${category}&info=${info}&won=${won}`;
    const response = await fetch(`/getNominations?${queryParameters}`);
    const data = await response.json();
    return data;
}

async function getNominees() {
    clearOutput();
    let result = await filterNomineesByInputs();
    displayingNomineesResults(result);
}

async function filterNomineesByInputs() {
    const nominee = getInputValue("nominees-nominee");
    const won = getInputValue("nominees-won");
    const queryParameters = `nominee=${nominee}&won=${won}`;
    const response = await fetch(`/getNominees?${queryParameters}`);
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
        </tr>`;
        nominees += y;
    });

    const header = '<thead class="thead-dark"><tr><th>Nominee</th><th>Number of times</th></tr></thead>';
    let table = `<table class="table table-striped">${header}<tbody>${nominees}</tbody></table>`;

    const nomineeDiv = document.createElement("div");
    nomineeDiv.innerHTML = table;

    const outputDiv = document.getElementById("output");
    outputDiv.appendChild(nomineeDiv);
}

function getInputValue(id) {
    return document.getElementById(id).value.toLowerCase();
}

function clearInput(formId) {
    document.getElementById(formId).reset();
}

function clearOutput() {
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
