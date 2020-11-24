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

FYSCloud.API.queryDatabase(
    "SELECT * FROM user"
).done(function (data) {
    for (let i = 0; i < data.length; i++) {
        var tR = document.createElement("TR");
        tR.setAttribute("id", "myTr-" + i);
        document.getElementById("myTable").appendChild(tR);

        var tD1 = document.createElement("TD");
        var tD2 = document.createElement("TD");
        var tD3 = document.createElement("TD");
        var tD4 = document.createElement("TD");

        var cell1 = document.createTextNode(data[i]['voornaam']);
        var cell2 = document.createTextNode(data[i]['achternaam']);
        var cell3 = document.createTextNode(data[i]['email']);
        var cell4 = document.createTextNode(data[i]['age']);

        tD1.appendChild(cell1);
        tD2.appendChild(cell2);
        tD3.appendChild(cell3);
        tD4.appendChild(cell4);

        document.getElementById("myTr-" + i).appendChild(tD1);
        document.getElementById("myTr-" + i).appendChild(tD2);
        document.getElementById("myTr-" + i).appendChild(tD3);
        document.getElementById("myTr-" + i).appendChild(tD4);
    }
}).fail(function (reason) {
    console.log(reason);
});