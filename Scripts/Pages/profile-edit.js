let username = document.querySelector('#Username').value;
let firstname = document.querySelector("#FirstName").value;
let lastname = document.querySelector("#LastName").value;
let dob = document.querySelector("#DateOfBirth").value;
let biography = document.querySelector("#Biography").value;
let email = document.querySelector("#Email").value;
let tel = document.querySelector("#Telephone").value;
let destination = document.querySelector("#Destination").value;
let startdate = document.querySelector("#Data").value;
let enddate = document.querySelector("#Data2").value;

function applyChanges() {
    document.getElementById("saveChangesBtn").addEventListener("click", function (event) {
        FYSCloud.API.queryDatabase(
            "UPDATE `profile` SET `firstname` = ?, `lastname` = ? WHERE `id` = 316;",
            [firstname, lastname]
        ).done(function (data) {
            console.log(data);
        }).fail(function (reason) {
            console.log(reason)
        })
    });
}

// let imgLoc;
// $("#fileUpload").on("change", function () {
//     FYSCloud.Utils.getDataUrl($(this)).done(function (data) {
//         if (data.isImage) {
//             $("#imagePreview").attr("src", data.url)
//         } else {
//             $("#imagePreview").attr("src", null,)
//         }
//     }).fail(function (reason) {
//         $("#filePreviewResult").html(reason)
//     })
// })

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
    if(gendertest === "male") {
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
    "SELECT * FROM buddy where id = ?", [userId]
).done(function (data) {
    console.log(data);
    let userData = data[0];
    let buddy;
    if (userData.type === "both") {
        buddy = "a buddy";
        document.getElementById("Choice1").checked = true;
        document.getElementById("Choice2").checked = true;
    } else if (userData.type === "activity") {
        buddy = "an activity buddy"
        document.getElementById("Choice2").checked = true;
    } else if (userData.type === "travel") {
        buddy = "a travel buddy"
        document.getElementById("Choice1").checked = true;
    }
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