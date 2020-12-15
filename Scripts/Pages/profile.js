var profileTranslation = {
    profile: {
        username: {
            nl: "Gebruikersnaam: ",
            en: "Username: "
        },
        firstname: {
            nl: "Voornaam: ",
            en: "First name: "
        },
        lastname: {
            nl: "Achternaam: ",
            en: "Last name: "
        },
        gender: {
            nl: "Geslacht",
            en: "Gender"
        },
        age: {
            nl: "leeftijd: ",
            en: "Age: "
        },
        ageTitle: {
            nl: "Leeftijd",
            en: "Age"
        },
        dob: {
            nl: "Geboortedatum: ",
            en: "Date of Birth: "
        },
        destination: {
            nl: "Bestemming: ",
            en: "Destination: "
        },
        from: {
            nl: "Van: ",
            en: "From: "
        },
        untill: {
            nl: "Tot: ",
            en: "Untill: "
        },
        lookingfor: {
            nl: "Opzoek naar: ",
            en: "I am looking for: "
        },
        phone: {
            nl: "Tel: ",
            en: "Phone: "
        },
        contact: {
            nl: "Contact Informatie",
            en: "Contact Information"
        },
        trip: {
            nl: "Trip Informatie",
            en: "Trip Information"
        },
        editbutton:{
            nl: "Profiel Aanpassen",
            en: "Edit Profile"
        },
        interest:{
            nl: "Interesses",
            en: "Interests"
        },
        bio:{
            nl: "Biografie",
            en: "Biography"
        },
        block:{
            nl: "Blokkeer",
            en: "Block"
        },
        match:{
            nl: "Stuur vriendschapsverzoek",
            en: "Send request"
        }
    }
};
FYSCloud.Localization.CustomTranslations.addTranslationJSON(profileTranslation);

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
    "SELECT `destination` FROM location where id = ?", [profileId]
).done(function (data) {
    console.log(data);
    generateDestination(data);
    FYSCloud.Localization.translate(false);
}).fail(function () {
    alert("paniek");
});

FYSCloud.API.queryDatabase(
    "SELECT * FROM userinterest where userId = ?", [profileId]
).done(function (data) {
    console.log(data);
    generateInterests(data);
    FYSCloud.Localization.translate(false);
}).fail(function () {
    alert("paniek");
});

FYSCloud.API.queryDatabase(
    "SELECT * FROM `friend`"
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
    } else if (currentUserId === profileId) {
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

function generateDestination(data) {
    let userData = data[0];
    let destination = userData.destination == null ? "" : userData.destination;
    $("#destination").html("<b data-translate='profile.destination'>Destination: </b>" + destination);
}

function generateInterests(data) {
    for (let i = 0; i < data.length; i++) {
        $("#interests").append("<div style='color: var(--color-corendon-white);\n" +
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
            "    margin: 2px;'>" + data[i].interestId + "<div>");
    }
}

let imgLoc;
$("#fileUpload").on("change", function () {
    FYSCloud.Utils.getDataUrl($(this)).done(function (data) {
        if (data.isImage) {
            $("#imagePreview").attr("src", data.url)
        } else {
            $("#imagePreview").attr("src", null,)
        }
    }).fail(function (reason) {
        $("#filePreviewResult").html(reason)
    })
})

if (currentUserId !== profileId) {
    $("#profileButtons").append(
    `<button type="button" onclick="changeButton()" id="match" class="match" data-translate="profile.match">Send Request</button>
        <button type="button" onclick="changeButton2()" id="block" class="block" data-translate="profile.block">Block</button>`);
} else if (currentUserId === profileId) {
    $("#saveChangesBtn").append(`<button class="saveChangesBtn" type="submit" data-translate="profile.editbutton">Edit profile</button>`)
}


