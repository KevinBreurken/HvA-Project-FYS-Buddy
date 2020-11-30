function showDetails() {
    let overlay = document.getElementById('overlay')
    let overlayBackground = document.getElementById('overlay-background')
    overlay.style.display = 'block'
    overlayBackground.style.display = 'block'
}

function closeDetails() {
    let overlay = document.getElementById('overlay')
    let overlayBackground = document.getElementById('overlay-background')
    overlay.style.display = 'none'
    overlayBackground.style.display = 'none'
}

function deleteRow(number) {
    let overlay = document.getElementById('row-data-' + number)
    overlay.remove()
}

// Temporary dummy database connection - will be removed once moved out of development
FYSCloud.API.configure({
    url: "https://api.fys.cloud",
    apiKey: "fys_is111_1.14Sh6xypTzeSUHD4",
    database: "fys_is111_1_dev_kiet",
    environment: "dev"
});

FYSCloud.API.queryDatabase(
    "SELECT * FROM user"
).done(function (data) {
    var tdArray = [];
    var cellArray = [];

    // Create a <tr> element for each property in the object
    for (let i = 0; i < data.length; i++) {
        var tr = document.createElement("TR");
        tr.setAttribute("id", "Tr-" + i);
        document.getElementById("tableBody").appendChild(tr);

        // Create a <td> element for each attribute in the object
        for (let j = 0; j < Object.keys(data[0]).length; j++) {
            tdArray[j] = document.createElement("TD");
            cellArray[j] = document.createTextNode(data[i][Object.keys(data[0])[j]]);
            tdArray[j].appendChild(cellArray[j]);
            document.getElementById("Tr-" + i).appendChild(tdArray[j]);
        }
    }
}).fail(function (reason) {
    console.log(reason);
});