var statisticsTranslation = {
    table: {
        head: {
            id: {
                nl: "Id",
                en: "Id"
            },
            email: {
                nl: "E-mail",
                en: "Email"
            },
            password: {
                nl: "Wachtwoord",
                en: "Password"
            },
            username: {
                nl: "Gebruikersnaam",
                en: "Username"
            },
            firstname: {
                nl: "Voornaam",
                en: "Firstname"
            },
            lastname: {
                nl: "Achternaam",
                en: "Lastname"
            },
            edit: {
                nl: "Wijzig",
                en: "Edit"
            },
            delete: {
                nl: "Verwijder",
                en: "Delete"
            }
        },
        body: {
            delete: {
                nl: "Verwijder",
                en: "Delete"
            },
            edit: {
                nl: "Wijzig",
                en: "Edit"
            }
        }
    },
    edit: {
        head: {
            nl: "Extra gebuikers informatie",
            en: "Extra user information",
            subhead1: {
                nl: "Gebruiker informatie",
                en: "User information"
            },
            subhead2: {
                nl: "Profiel informatie",
                en: "Profile information"
            }
        },
        button: {
            nl: "Bijwerken",
            en: "Update"
        }
    }
}

FYSCloud.Localization.CustomTranslations.addTranslationJSON(statisticsTranslation)

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

let editUserOverlay = document.getElementById("edit-user")

function editUser(i) {
    FYSCloud.API.queryDatabase(
        "SELECT u.*, p.* FROM fys_is111_1_dev.user u INNER JOIN fys_is111_1_dev.profile p ON p.userId = u.id WHERE `userId` = ?",
        [i]
    ).done(function (data) {
        console.log(data[0]['pictureUrl'])
        $("#profile-photo").attr("src", "https://dev-is111-1.fys.cloud/uploads/profile-pictures/" + data[0]['pictureUrl'])

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
    //let id = $('#user-info-0').val()
    let email = $('#user-info-1').val()
    let password = $('#user-info-2').val()
    let username = $('#user-info-3 ').val()
    //let userId = $('#user-info-4 ').val()
    let firstname = $('#user-info-5 ').val()
    let lastname = $('#user-info-6 ').val()
    let gender = $('#user-info-7 ').val()
    let dob = $('#user-info-8 ').val()
    let locationId = $('#user-info-9 ').val()
    let phone = $('#user-info-10 ').val()
    let biography = $('#user-info-11 ').val()
    let buddyType = $('#user-info-12 ').val()
    let pictureUrl = $('#user-info-13 ').val()

    FYSCloud.API.queryDatabase(
        "UPDATE user SET id = ?, email = ?, password = ?, username = ? WHERE id = ?; UPDATE profile SET id = ?, userId = ?,firstname = ?, lastname = ?, gender = ?, dob = ?, locationId = ?, phone = ?, biography = ?, buddyType = ?, pictureUrl = ? WHERE  id = ?",
        [i, email, password, username, i, i, i, firstname, lastname, gender, dob, locationId, phone, biography, buddyType, pictureUrl, i]
    ).done(function (data) {
        location.reload()
    }).fail(function (reason) {
        console.log(reason)
    })
}
