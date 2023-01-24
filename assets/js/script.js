const API_KEY = "Zwpnuehc_r8EZVn_9TvypCd3070";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e));
document.getElementById("submit").addEventListener("click", e => postForm(e));

async function postForm(e) {
    const form = new FormData(document.getElementById("checksform"));

    const response = await fetch(API_URL, {
                                method: "POST",
                                headers: {
                                    "Authorization": API_KEY,
                                },
                                body: form,
    });

    const data = await response.json();

    if (response.ok){
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }
}

function displayErrors(data){
    let heading = `JSHint results for ${data.file}`;
    if (data.total_errors === 0){
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`

        for (let error of data.error_list){
            results += `<div>At line <span class="line">${error.line}</span>,`;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }

        document.getElementById("resultsModalTitle").innerText = heading;
        document.getElementById("results-content").innerHTML = results;
        resultsModal.show();
    }
}

// 1.Make a GET request to the API URL with the API KEY
async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`;
    results += `<div class="key-status"><b>${data.expiry}</b></div>`

    document.getElementById("resultsModalTitle").innerText = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}
// 2.Pass the data to a display function