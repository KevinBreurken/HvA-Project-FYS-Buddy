let editUserOverlay = $("#edit-user")
let overlayBackground = $("#overlay-background")

/**
 * Close the user details card
 */
function closeDetails() {
    editUserOverlay.hide()
    overlayBackground.hide()
}

/**
 * Delete the selected user
 *
 * @param i user index
 */
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
                adminButton.setAttribute("data-translate", "table.body.delete")
                document.getElementById("td-" + row + "-" + column).appendChild(adminButton)
            } else {
                adminButton.innerHTML = "Edit"

                // Create an onclick with parameter in the button which will delete a user
                adminButton.setAttribute("onclick", "editUser(" + data[row]["id"] + ")")
                adminButton.setAttribute("data-translate", "table.body.edit")
                document.getElementById("td-" + row + "-" + column).appendChild(adminButton)
            }
        }
    }
}).fail(function (reason) {
    console.log(reason)
})

/**
 * Gather all the data from the selected user and display them in a card
 *
 * @param i user index
 */
function editUser(i) {
    FYSCloud.API.queryDatabase(
        "SELECT u.*, p.* FROM user u INNER JOIN profile p ON p.userId = u.id WHERE `userId` = ?",
        [i]
    ).done(function (data) {
        $("#profile-photo").attr("src", `https://${environment}-is111-1.fys.cloud/uploads/profile-pictures/` + data[0]['pictureUrl'])

        // For each column in the user table create an attribute and set a value
        for (let j = 0; j < Object.keys(data[0]).length; j++) {
            document.getElementById('user-attribute-' + j).innerHTML = Object.keys(data[0])[j] + ": "
            document.getElementById('user-info-' + j).value = data[0][Object.keys(data[0])[j]]
        }

        // Put the date of birth from the user in the dob input
        $('#user-info-9').val(parseDateToInputDate(data[0]['dob']))

        // Set the onclick attribute with the index of submitForm being the [i] selected user
        $("#submit-form").attr("onclick", "submitForm(" + i + ")")

        // Show the edit user overlay
        editUserOverlay.show()
        overlayBackground.show()
            }).fail(function (reason) {
        console.log(reason)
    })
}

/**
 * Function for submitting values from input fields to database tables
 *
 * @param i user index
 */
function submitForm(i) {
    //Get All the values from user-info fields
    let email = $('#user-info-1').val()
    let password = $('#user-info-2').val()
    let username = $('#user-info-3 ').val()
    let userRole = $('#user-info-4 ').val()
    //let userId = $('#user-info-5 ').val()
    let firstname = $('#user-info-6 ').val()
    let lastname = $('#user-info-7 ').val()
    let gender = $('#user-info-8 ').val()
    let dob = $('#user-info-9 ').val()
    let locationId = $('#user-info-10 ').val()
    let phone = $('#user-info-11 ').val()
    let biography = $('#user-info-12').val()
    let buddyType = $('#user-info-13 ').val()
    let pictureUrl = $('#user-info-14 ').val()

    // Update the user and profile tables with the values from user-info fields
    FYSCloud.API.queryDatabase(
        "UPDATE user SET id = ?, email = ?, password = ?, username = ?, userRole = ? WHERE id = ?; UPDATE profile SET id = ?, userId = ?,firstname = ?, lastname = ?, gender = ?, dob = ?, locationId = ?, phone = ?, biography = ?, buddyType = ?, pictureUrl = ? WHERE  id = ?",
        [i, email, password, username, userRole, i, i, i, firstname, lastname, gender, dob, locationId, phone, biography, buddyType, pictureUrl, i]
    ).done(function (data) {
        location.reload()
    }).fail(function (reason) {
        console.log(reason)
    })
}
