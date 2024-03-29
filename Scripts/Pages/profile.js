let count;
/**
 * get id from the pageurl
 */
//get the url
var pageUrl = window.location.href;

//split at the userId
var array1 = pageUrl.split("id=");

let profileId = array1[1];
if (array1 === null) {
    profileId = getCurrentUserID();
}
let currentUserId = getCurrentUserID();

FYSCloud.API.queryDatabase(
    "SELECT * FROM profile where userId = ?", [profileId]
).done(function (data) {
    if (data.length === 0) {
        return;
    }
    generateProfileDisplay(data);
    generateBuddy(data);
    CustomTranslation.translate(false);
}).fail(function () {
});

FYSCloud.API.queryDatabase(
    "SELECT * FROM user WHERE id = ?", [profileId]
).done(function (data) {
    if (data.length === 0) {
        return;
    }
    generateUserinfo(data);
    CustomTranslation.translate(false);
}).fail(function () {
});

FYSCloud.API.queryDatabase(
    "SELECT * FROM travel where userId = ?", [profileId]
).done(function (data) {
    if (data.length === 0) {
        return;
    }
    generateTravelInfo(data);
    CustomTranslation.translate(false);
}).fail(function () {
});

FYSCloud.API.queryDatabase(
    "SELECT * FROM travel where userId = ?", [profileId]
).done(function (data) {
    if (data.length === 0) {
        return;
    }
    let userData = data[0];
    let locatie = userData.locationId;
    FYSCloud.API.queryDatabase(
        "SELECT * FROM `location` WHERE `id` = ?;",
        [locatie]
    ).done(function (data) {
        if (data.length === 0) {
            return;
        }
        let userdata = data[0];
        let destination = userdata.destination;
        $("#destination").html("<b data-translate='profile.destination'>Destination: </b>" + destination);
        FYSCloud.Localization.translate(false);
    }).fail(function (reason) {
    });
}).fail(function () {
});

/**
 * Contactinformation is only shown at your page if you look at it yourself, or if you're friends.
 */
if (currentUserId === profileId) {
    generateContactinfo();
} else {
    let userId = getCurrentUserID();
    FYSCloud.API.queryDatabase(
        "SELECT * FROM `friend` WHERE `user1` = ? OR `user2` = ?;", [userId, userId]
    ).done(function (data) {
        if (data.length === 0) {
            return;
        }
       FYSCloud.Localization.translate(false);
        let userData = data[0];
        let tabel1 = userData.user1;
        let tabel2 = userData.user2;
        if ((tabel2 == currentUserId && tabel1 == profileId) || (tabel1 == currentUserId && tabel2 == profileId)) {
            generateContactinfo();
            FYSCloud.API.queryDatabase(
                "SELECT * FROM user where id = ?", [profileId]
            ).done(function (data) {
                if (data.length === 0) {
                    return;
                }
                generateUserinfo(data);
                FYSCloud.API.queryDatabase(
                    "SELECT * FROM profile where id = ?", [profileId]
                ).done(function (data) {
                    if (data.length === 0) {
                        return;
                    }
                    generateProfileDisplay(data);
                    generateBuddy(data);
                    CustomTranslation.translate(false);
                }).fail(function () {
                });
            }).fail(function () {
            });
        }
    }).fail(function () {
    });
}

/**
 * Functions to display user info.
 * @param data is data from the database that the user has send at the registration page.
 */
function generateContactinfo() {
    $("#contactinformation").append(`<h2 data-translate="profile.contact">Contactinformation</h2>
            <p id="email"><b>E-mail:</b></p>
            <p id="tel"><b>Tel:</b></p>`);
}

function generateProfileDisplay(data) {
    let userData = data[0];
    let url = userData.pictureUrl === "" ? `${environment}/uploads/profile-pictures/default-profile-picture.png` : `${environment}/uploads/profile-pictures/` + userData.pictureUrl;
    let firstname = userData.firstname == null ? "" : userData.firstname;
    let lastname = userData.lastname == null ? "" : userData.lastname;
    let gender = userData.gender == null ? "" : userData.gender;
    let date = new Date(userData.dob);
    let dob = userData.dob == null ? "" : `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    let dateofbirth = userData.dob;
    let today = new Date();
    let birthDate = new Date(dateofbirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate()))
    {
        age--;
    }
    let biography = userData.biography == null ? "" : userData.biography;
    let tel = userData.phone == null ? "" : userData.phone;

    $("#img").attr("src", url);
    $("#firstname").html("<b data-translate='profile.firstname'>First name: </b>" + firstname);
    $("#lastname").html("<b data-translate='profile.lastname'>Last name: </b>" + lastname);
    $("#gender").attr('data-translate',`gender.${gender}`);
    $("#age").html("<b data-translate='profile.age'>Age: </b>" + age);
    $("#dob").html("<b data-translate='profile.dob'>Date of birth: </b>" + dob);
    $("#biography").html(biography);
    $("#tel").html("<b data-translate='profile.phone'>Tel: </b>" + tel);
}

function generateTravelInfo(data) {
    let userData = data[0];

    let date = new Date(userData.startdate);
    let start_date = userData.startdate == null ? "" : `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    let date2 = new Date(userData.enddate);
    let end_date = userData.enddate == null ? "" : `${date2.getFullYear()}-${date2.getMonth() + 1}-${date2.getDate()}`;
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

/**
 * Gets all the interests from the database and displays them in a red-colored badge.
 */

$(document).ready(function() {
FYSCloud.API.queryDatabase(
    "SELECT * FROM `userinterest` where userId = ?", [profileId]
).done(function (data) {
    for (let i = 0; i < data.length; i++) {
    let userData = data[i];
    let interests = [];
    interests[i] = userData.interestId;
        FYSCloud.API.queryDatabase(
            "SELECT * FROM `interest` WHERE `id` = ?;",
            [interests[i]]
        ).done(function (interestData) {
            for (let j = 0; j < interestData.length; j++) {
                $("#interests").append(`<div data-translate='interests.${interestData[j].id}' style=
                    'color: var(--color-corendon-white);\n` +
                    "    background-color: var(--color-corendon-red);\n" +
                    "    display: inline-block;\n" +
                    "    padding: .25em .4em;\n" +
                    "    font-size: 90%;\n" +
                    "    font-weight: 700;\n" +
                    "    line-height: 3;\n" +
                    "    text-align: center;\n" +
                    "    white-space: nowrap;\n" +
                    "    vertical-align: baseline;\n" +
                    "    border-radius: 10px;\n" +
                    "    margin: 2px;'>" + interestData[j] + "<div>");
                FYSCloud.Localization.translate(false);
            }
        }).fail(function (reason) {
        });
    }
}).fail(function () {
});
});

/**
 * Checks if the current user wants to display their own profile or another user's profile.
 */
if (currentUserId !== profileId) {
    $("#profileButtons").append(
    `<button type="button" onclick="requestFriend()" id="match" class="match" data-translate="profile.match">Send Request</button>
     <button type="button" onclick="blockUser()" id="block" class="block" data-translate="profile.block">Block</button>`);
} else if (currentUserId === profileId) {
    $("#saveChangesBtn").append(`<button class="saveChangesBtn" type="submit" data-translate="profile.editbutton">Edit profile</button>`)
}

/**
 * When the user clicks on the friendrequest button, the request will be sent to the database.
 */
function requestFriend() {
    FYSCloud.API.queryDatabase(
        "INSERT INTO `friendrequest` (`requestingUser`, `targetUser`) VALUES (?, ?);", [currentUserId, profileId]
    ).done(function (data) {
    }).fail(function () {
    });
}

/**
 * When the user clicks on the block button, the request will be sent to the database.
 */
function blockUser() {
    FYSCloud.API.queryDatabase(
        "INSERT INTO `blocked` (`requestingUser`, `blockedUser`, `reason`) VALUES (?, ?, ?);", [currentUserId, profileId, "Blocked through profile page"]
    ).done(function (data) {
        redirectToHome();
    }).fail(function () {
    });
}
