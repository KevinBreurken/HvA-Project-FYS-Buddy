
document.getElementById("saveChangesBtn").addEventListener("click", function (event) {
    event.preventDefault();
    let firstname = document.querySelector("#FirstName").value;
    let lastname = document.querySelector("#LastName").value;
    let biography = document.querySelector("#Biography").value;
    let tel = document.querySelector("#Telephone").value;

    FYSCloud.API.queryDatabase(
        "UPDATE `profile` SET `firstname` = ?, `lastname` = ?, `biography` = ?, `phone` = ? WHERE `id` = ?;",
        [firstname, lastname, biography, tel, userId]
    ).done(function (data) {
        console.log(data);
        window.location.href = "profile.html";
    }).fail(function (reason) {
        console.log(reason)
    });

    let email = document.querySelector("#Email").value;
    let username = document.querySelector('#Username').value;

    FYSCloud.API.queryDatabase(
        "UPDATE `user` SET `email` = ?, `username` = ? WHERE `id` = ?;",
        [email, username, userId]
    ).done(function (data) {
        console.log(data);
        window.location.href = "profile.html";
    }).fail(function (reason) {
        console.log(reason)
    });

    let destination = document.querySelector("#Destination").value;

    FYSCloud.API.queryDatabase(
        "UPDATE `location` SET `destination` = ? WHERE `id` = ?;",
        [destination, userId]
    ).done(function (data) {
        console.log(data);
        window.location.href = "profile.html";
    }).fail(function (reason) {
        console.log(reason)
    });
});

    FYSCloud.API.queryDatabase(
        "SELECT * FROM user where id = ?", [userId]
    ).done(function (data) {
        console.log(data);
        let userData = data[0];
        $("#Email").val(userData.email);
        $("#Username").val(userData.username);
    }).fail(function () {
        alert("paniek");
    });

    FYSCloud.API.queryDatabase(
        "SELECT * FROM profile where id = ?", [userId]
    ).done(function (data) {
        console.log(data);
        let userData = data[0];
        let gendertest = userData.gender;
        if (gendertest === "male") {
            document.getElementById("Male").checked = true;
        } else if (gendertest === "female") {
            document.getElementById("Female").checked = true;
        } else {
            document.getElementById("Other").checked = true;
        }
        $("#FirstName").val(userData.firstname);
        $("#LastName").val(userData.lastname);
        $("#DateOfBirth").val(userData.dob);
        $("#Biography").val(userData.biography);
        $("#Telephone").val(userData.phone);
    }).fail(function () {
        alert("paniek");
    });

    FYSCloud.API.queryDatabase(
        "SELECT * FROM location where id = ?", [userId]
    ).done(function (data) {
        console.log(data);
        let userData = data[0];
        $("#Destination").val(userData.destination);
    }).fail(function () {
        alert("paniek");
    });

    FYSCloud.API.queryDatabase(
        "SELECT * FROM travel where id = ?", [1]
    ).done(function (data) {
        console.log(data);
        let userData = data[0];

        userData.startdate = new Date();
        let start = userData.startdate.toLocaleDateString('en-CA');
        $("#Data").val(start);

        userData.enddate = new Date();
        let end = userData.enddate.toLocaleDateString('en-CA');
        $("#Data2").val(end);
    }).fail(function () {
        alert("paniek");
    });