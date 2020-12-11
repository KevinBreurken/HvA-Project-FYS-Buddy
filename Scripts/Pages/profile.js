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

function AgeCheck() {
    const MIN_AGE = 18;
    const MAX_AGE = 100;

    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear() - MIN_AGE;
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    today = yyyy + '-' + mm + '-' + dd;

    let ageCheck = new Date();
    let day = ageCheck.getDate();
    let month = ageCheck.getMonth() + 1;
    let year = ageCheck.getFullYear() - MAX_AGE;
    if (day < 10) {
        day = '0' + day
    }
    if (month < 10) {
        month = '0' + month
    }
    ageCheck = year + '-' + month + '-' + day;
    // TODO: fix bug.
//document.getElementById("dateOfBirth").setAttribute("max", today);
//document.getElementById("dateOfBirth").setAttribute("min", ageCheck);
}

let count;

function countCharacters() {
    var textEntered, countRemaining, counter;
    textEntered = document.getElementById('biography').value;
    counter = (500 - (textEntered.length));
    countRemaining = document.getElementById('charactersRemaining');
    countRemaining.textContent = counter;
}

//count = document.getElementById('biography');
//count.addEventListener('keyup', countCharacters, false);
//let userId5 = getCurrentUserID();
// TODO: get the id from url for profile display.
//get the url
var pageUrl = window.location.href;

//split at the userId
var array1 = pageUrl.split("id=");
console.log(array1[1]);

let profileId = array1[1];
let currentUserId = getCurrentUserID();

FYSCloud.API.queryDatabase(
    "SELECT * FROM profile where id = ?", [profileId]
).done(function (data) {
    console.log(data);
    generateProfileDisplay(data);
    generateBuddy(data);
}).fail(function () {
    alert("paniek");
});

FYSCloud.API.queryDatabase(
    "SELECT * FROM user where id = ?", [profileId]
).done(function (data) {
    console.log(data);
    generateUserinfo(data);
}).fail(function () {
    alert("paniek");
});

FYSCloud.API.queryDatabase(
    "SELECT * FROM travel where id = ?", [profileId]
).done(function (data) {
    console.log(data);
    generateTravelInfo(data);
}).fail(function () {
    alert("paniek");
});

FYSCloud.API.queryDatabase(
    "SELECT `destination` FROM location where id = ?", [profileId]
).done(function (data) {
    console.log(data);
    generateDestination(data);
}).fail(function () {
    alert("paniek");
});

FYSCloud.API.queryDatabase(
    "SELECT * FROM userinterest where userId = ?", [profileId]
).done(function (data) {
    console.log(data);
    generateInterests(data);
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

$.getJSON("https://api.ipify.org?format=json", function (data) {
    $("#rightbox").html(data.ip);
})

let current = new Date();
let currentdate = current.getFullYear() + "-" + (current.getMonth() + 1) + "-" + current.getDate();
let currenttime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
let datetime = currentdate + " " + currenttime;

$("#leftbox").html(datetime);

// TODO: make translation language dynamic.
// document.addEventListener("languageChangeEvent", function (event) {
//     console.log(event.detail.id);
//     let newString = FYSCloud.Localization.Buddy.addTranslationJSON("profile.username");
//     newString = newString.replace("");
// });

if (currentUserId !== profileId) {
    $("#profileButtons").append(
    `<input type="button" onclick="changeButton()" id="match" class="match" value="Send request">
        <input type="button" onclick="changeButton2()" id="block" class="block" value="Block">`);
} else if (currentUserId === profileId) {
    $("#button").append(`<button class="saveChangesBtn" type="submit" data-translate="profile.editbutton">Edit profile</button>`)
}