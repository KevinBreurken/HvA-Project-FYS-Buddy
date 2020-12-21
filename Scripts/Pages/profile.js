
function changeButton() {
    document.getElementById('match').value = "Requested";
}

function changeButton2() {
    document.getElementById('block').value = "Blocked";
}
let count;

//get the url
var pageUrl = window.location.href;

//split at the userId
var array1 = pageUrl.split("id=");
console.log(array1[1]);

let profileId = array1[1];
if (array1 === null) {
    profileId = getCurrentUserID();
}
let currentUserId = getCurrentUserID();

FYSCloud.API.queryDatabase(
    "SELECT * FROM profile where id = ?", [profileId]
).done(function (data) {
    console.log(data);
    generateProfileDisplay(data);
    generateBuddy(data);
    FYSCloud.Localization.translate(false);
}).fail(function () {
    alert("paniek");
});

FYSCloud.API.queryDatabase(
    "SELECT * FROM user where id = ?", [profileId]
).done(function (data) {
    console.log(data);
    generateUserinfo(data);
    FYSCloud.Localization.translate(false);
}).fail(function () {
    alert("paniek");
});

FYSCloud.API.queryDatabase(
    "SELECT * FROM travel where id = ?", [profileId]
).done(function (data) {
    console.log(data);
    generateTravelInfo(data);
    FYSCloud.Localization.translate(false);
}).fail(function () {
    alert("paniek");
});

FYSCloud.API.queryDatabase(
    "SELECT * FROM travel where id = ?", [profileId]
).done(function (data) {
    let userData = data[0];
    let locatie = userData.locationId;
    console.log(data);
    FYSCloud.Localization.translate(false);
    FYSCloud.API.queryDatabase(
        "SELECT * FROM `location` WHERE `id` = ?;",
        [locatie]
    ).done(function (data) {
        let userdata = data[0];
        console.log(data);
        let destination = userdata.destination;
        FYSCloud.Localization.translate(false);
        $("#destination").html("<b data-translate='profile.destination'>Destination: </b>" + destination);
    }).fail(function (reason) {
        console.log(reason)
    });
}).fail(function () {
    alert("paniek");
});

FYSCloud.API.queryDatabase(
    "SELECT * FROM userinterest where userId = ?", [profileId]
).done(function (data) {
    console.log(data);
    //generateInterests(data);
    FYSCloud.Localization.translate(false);
}).fail(function () {
    alert("paniek");
});

if (currentUserId === profileId) {
    $("#contactinformation").append(`<h2 data-translate="profile.contact">Contactinformation</h2>
            <p id="email"><b>E-mail:</b></p>
            <p id="tel"><b>Tel:</b></p>`);
    FYSCloud.API.queryDatabase(
        "SELECT * FROM user where id = ?", [profileId]
    ).done(function (data) {
        console.log(data);
        generateUserinfo(data);
        FYSCloud.Localization.translate(false);
        FYSCloud.API.queryDatabase(
            "SELECT * FROM profile where id = ?", [profileId]
        ).done(function (data) {
            console.log(data);
            generateProfileDisplay(data);
            generateBuddy(data);
            FYSCloud.Localization.translate(false);
        }).fail(function () {
            alert("paniek");
        });
    }).fail(function () {
        alert("paniek");
    });
} else {
    let userId = getCurrentUserID();
    FYSCloud.API.queryDatabase(
        "SELECT * FROM `friend` WHERE `user1` = ? OR `user2` = ?;", [userId, userId]
    ).done(function (data) {
        FYSCloud.Localization.translate(false);
        console.log(data);
        let userData = data[0];
        let tabel1 = userData.user1;
        let tabel2 = userData.user2;
        console.log(tabel1);
        console.log(tabel2);
        if (tabel2 == currentUserId && tabel1 == profileId) {
            $("#contactinformation").append(`<h2 data-translate="profile.contact">Contactinformation</h2>
            <p id="email"><b>E-mail:</b></p>
            <p id="tel"><b>Tel:</b></p>`);
            FYSCloud.API.queryDatabase(
                "SELECT * FROM user where id = ?", [profileId]
            ).done(function (data) {
                console.log(data);
                generateUserinfo(data);
                FYSCloud.Localization.translate(false);
                FYSCloud.API.queryDatabase(
                    "SELECT * FROM profile where id = ?", [profileId]
                ).done(function (data) {
                    console.log(data);
                    generateProfileDisplay(data);
                    generateBuddy(data);
                    FYSCloud.Localization.translate(false);
                }).fail(function () {
                    alert("paniek");
                });
            }).fail(function () {
                alert("paniek");
            });
        } else if (tabel1 == currentUserId && tabel2 == profileId) {
            $("#contactinformation").append(`<h2 data-translate="profile.contact">Contactinformation</h2>
            <p id="email"><b>E-mail:</b></p>
            <p id="tel"><b>Tel:</b></p>`);
            FYSCloud.API.queryDatabase(
                "SELECT * FROM user where id = ?", [profileId]
            ).done(function (data) {
                console.log(data);
                generateUserinfo(data);
                FYSCloud.Localization.translate(false);
                FYSCloud.API.queryDatabase(
                    "SELECT * FROM profile where id = ?", [profileId]
                ).done(function (data) {
                    console.log(data);
                    generateProfileDisplay(data);
                    generateBuddy(data);
                    FYSCloud.Localization.translate(false);
                }).fail(function () {
                    alert("paniek");
                });
            }).fail(function () {
                alert("paniek");
            });
        }
    }).fail(function () {
        alert("paniek");
    });
}

function generateProfileDisplay(data) {
    let userData = data[0];
    let url = userData.pictureUrl === "" ? "https://dev-is111-1.fys.cloud/uploads/profile-pictures/default-profile-picture.png" : "https://dev-is111-1.fys.cloud/uploads/profile-pictures/" + userData.pictureUrl;
    let firstname = userData.firstname == null ? "" : userData.firstname;
    let lastname = userData.lastname == null ? "" : userData.lastname;
    let gender = userData.gender == null ? "" : userData.gender;
    let date = new Date(userData.dob);
    let dob = userData.dob == null ? "" : `${date.getDay()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    let ageBerekening = new Date().getFullYear() - date.getFullYear();
    let age = userData.dob == null ? "" : ageBerekening;
    let biography = userData.biography == null ? "" : userData.biography;
    let tel = userData.phone == null ? "" : userData.phone;

    $("#img").attr("src", url);
    $("#firstname").html("<b data-translate='profile.firstname'>First name: </b>" + firstname);
    $("#lastname").html("<b data-translate='profile.lastname'>Last name: </b>" + lastname);
    $("#gender").html(gender);
    $("#age").html("<b data-translate='profile.age'>Age: </b>" + age);
    $("#dob").html("<b data-translate='profile.dob'>Date of birth: </b>" + dob);
    $("#biography").html(biography);
    $("#tel").html("<b data-translate='profile.phone'>Tel: </b>" + tel);
}

function generateTravelInfo(data) {
    let userData = data[0];

    date = new Date(userData.startdate);
    let start_date = userData.startdate == null ? "" : `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    date = new Date(userData.enddate);
    let end_date = userData.enddate == null ? "" : `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    $("#from").html("<b data-translate='profile.from'>From: </b>" + start_date);
    $("#untill").html("<b data-translate='profile.untill'>Untill: </b>" + end_date);
}

function generateUserinfo(data) {
    let userData = data[0];
    let username = userData.username == null ? "" : userData.username;
    let email = userData.email == null ? "" : userData.email;
    $("#username").html("<b data-translate='profile.username'>Username: </b>" + username);
    $("#usernameTitle").html(username);
    $("#email").html("<b>E-mail: </b>" + email);
}

function generateBuddy(data) {
    let userData = data[0];
    let buddy;
    if (userData.buddyType === 1) {
        buddy = "a buddy";
        $("#lookingFor").html("<b data-translate='profile.lookingfor'>I am looking for: </b>" + buddy);
    } else if (userData.buddyType === 2) {
        buddy = "an activity buddy"
        $("#lookingFor").html("<b data-translate='profile.lookingfor'>I am looking for: </b>" + buddy);
    } else if (userData.buddyType === 3) {
        buddy = "a travel buddy"
        $("#lookingFor").html("<b data-translate='profile.lookingfor'>I am looking for: </b>" + buddy);
    }
}

FYSCloud.API.queryDatabase(
    "SELECT * FROM `userinterest` where userId = ?", [profileId]
).done(function (data) {
    for (let i = 0; i < data.length; i++) {
    let userData = data[i];
    let interests = [];
    interests[i] = userData.interestId;
    console.log(data);
    FYSCloud.Localization.translate(false);
        FYSCloud.API.queryDatabase(
            "SELECT * FROM `interest` WHERE `id` = ?;",
            [interests[i]]
        ).done(function (data) {
            for (let i = 0; i < data.length; i++) {
                $("#interests").append(`<div data-translate='interests.${data[i].id}' style='color: var(--color-corendon-white);\n` +
                    "    background-color: var(--color-corendon-red);\n" +
                    "    display: inline-block;\n" +
                    "    padding: .25em .4em;\n" +
                    "    font-size: 75%;\n" +
                    "    font-weight: 700;\n" +
                    "    line-height: 1;\n" +
                    "    text-align: center;\n" +
                    "    white-space: nowrap;\n" +
                    "    vertical-align: baseline;\n" +
                    "    border-radius: .25rem;\n" +
                    "    margin: 2px;'>" + "<div>");
            }
        }).fail(function (reason) {
            console.log(reason)
        });
    }
}).fail(function () {
    alert("paniek");
});

if (currentUserId !== profileId) {
    $("#profileButtons").append(
    `<button type="button" onclick="requestFriend()" id="match" class="match" data-translate="profile.match">Send Request</button>
     <button type="button" onclick="blockUser()" id="block" class="block" data-translate="profile.block">Block</button>`);
} else if (currentUserId === profileId) {
    $("#saveChangesBtn").append(`<button class="saveChangesBtn" type="submit" data-translate="profile.editbutton">Edit profile</button>`)
}

function requestFriend() {
    FYSCloud.API.queryDatabase(
        "INSERT INTO `friendrequest` (`requestingUser`, `targetUser`) VALUES (?, ?);", [currentUserId, profileId]
    ).done(function (data) {
        console.log(data);
    }).fail(function () {
        alert("paniek");
    });
}

function blockUser() {
    FYSCloud.API.queryDatabase(
        "INSERT INTO `blocked` (`requestingUser`, `blockedUser`) VALUES (?, ?);", [currentUserId, profileId]
    ).done(function (data) {
        console.log(data);
    }).fail(function () {
        alert("paniek");
    });
}