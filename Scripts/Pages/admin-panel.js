function closeDetails() {
    let overlay = document.getElementById('overlay')
    let overlayBackground = document.getElementById('overlay-background')
    overlay.style.display = 'none'
    overlayBackground.style.display = 'none'
}

// Temporary dummy database connection - will be removed once moved out of development
FYSCloud.API.configure({
    url: "https://api.fys.cloud",
    apiKey: "fys_is111_1.14Sh6xypTzeSUHD4",
    database: "fys_is111_1_dev_kiet",
    environment: "dev"
})

function deleteUser(i) {
    FYSCloud.API.queryDatabase(
        "DELETE FROM `user` WHERE id="+i
    ).done(function (data) {
        //console.log(data);
        location.reload();
    }).fail(function (reason) {
        console.log(reason)
    })

}

FYSCloud.API.queryDatabase(
    "SELECT * FROM user"
).done(function (data) {

    var tdArray = []
    var cellArray = []
    const btnCol = 2

    // TODO Unsure about using standard variables(i, j) for the for loop or row. column
    // Create a row element for each property in the object
    for (let row = 0; row < data.length; row++) {
        var tr = document.createElement("tr")

        // Set unique attributes for each row
        tr.setAttribute("id", "tr-" + row)
        document.getElementById("tableBody").appendChild(tr)

        // Create a column element for each attribute in the object
        for (let column = 0; column < Object.keys(data[0]).length; column++) {
            tdArray[column] = document.createElement("td")
            cellArray[column] = document.createTextNode(data[row][Object.keys(data[0])[column]])
            tdArray[column].appendChild(cellArray[column])
            document.getElementById("tr-" + row).appendChild(tdArray[column])
        }
        // Add two columns to each rows for admin buttons
        for (let column = 0; column < btnCol; column++) {
            var buttonTd = document.createElement("td")

            buttonTd.setAttribute("id", "td-" + row + "-" + column)
            document.getElementById("tr-" + row).appendChild(buttonTd)

            // First button is for deletion and second button for edit
            var adminButton = document.createElement("button")
            adminButton.setAttribute("class", "btn")

            if (column === 0) {
                adminButton.innerHTML = "Delete"
                // Create an onclick with parameter in the button which will delete a user
                adminButton.setAttribute("onclick", "deleteUser(" + data[row]["id"] + ")")
                document.getElementById("td-" + row + "-" + column).appendChild(adminButton)
            } else {
                adminButton.innerHTML = "Edit"
                document.getElementById("td-" + row + "-" + column).appendChild(adminButton)
            }
        }
    }
}).fail(function (reason) {
    console.log(reason)
})


