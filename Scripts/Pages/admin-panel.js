function closeDetails() {
    document.getElementById('edit-user').style.display = 'none'
    document.getElementById('overlay-background').style.display = 'none'
}

function deleteUser(i) {
    FYSCloud.API.queryDatabase(
        "DELETE FROM `user` WHERE id = ?",
        [i]
    ).done(function (data) {
        // TODO come up with a better way to reload the shown data on the page
        location.reload();
    }).fail(function (reason) {
        console.log(reason)
    })
}

FYSCloud.API.queryDatabase(
    "SELECT * FROM `user`"
).done(function (data) {
    var tdArray = []
    var cellArray = []
    const btnCol = 2
    let tableBody = document.getElementById("tableBody")

    // TODO Unsure about using standard variables(i, j) for the for loop or row. column
    // Create a row element for each property in the object
    for (let row = 0; row < data.length; row++) {
        var tr = document.createElement("tr")

        // Set unique attributes for each row
        tr.setAttribute("id", "tr-" + row)
        tableBody.appendChild(tr)

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
                // Create an onclick with parameter in the button which will delete a user
                adminButton.setAttribute("onclick", "editUser(" + data[row]["id"] + ")")
                document.getElementById("td-" + row + "-" + column).appendChild(adminButton)
            }
        }
    }
}).fail(function (reason) {
    console.log(reason)
})

let editUserOverlay = document.getElementById("edit-user")
function editUser(i) {
        FYSCloud.API.queryDatabase(
        "SELECT * FROM `user` WHERE id = ?",
        [i]
    ).done(function (data) {

        // For each column in the user table create an attribute and set a value
        for (let j = 0; j < Object.keys(data[0]).length; j++) {
            document.getElementById('user-attribute-' + j).innerHTML = Object.keys(data[0])[j] + ": "
            document.getElementById('user-info-' + j).value = data[0][Object.keys(data[0])[j]]
        }

        // Set the onclick attribute with the index of submitForm being the i selected user
        document.getElementById("submit-form").setAttribute("onclick", "submitForm(" + i + ")")

        // Show the edit user overlay
        editUserOverlay.style.display = 'block'
    }).fail(function (reason) {
        console.log(reason)
    })
}

function submitForm(i) {

    //let id = document.querySelector('#user-info-0').value
    let firstname = document.querySelector('#user-info-1').value
    let lastname = document.querySelector('#user-info-2').value
    let email = document.querySelector('#user-info-3').value
    let age = document.querySelector('#user-info-4').value

    console.log(lastname)
    FYSCloud.API.queryDatabase(
        "UPDATE `user` SET `firstname` = ?, `lastname` = ?, `email` = ?, `age` = ? WHERE `id` = ?",
        [firstname, lastname, email, age, i]
    ).done(function (data) {
        location.reload()
    }).fail(function (reason) {
        console.log(reason)
    })
}
