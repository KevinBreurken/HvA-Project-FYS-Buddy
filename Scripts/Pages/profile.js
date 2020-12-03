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
    counter = (500- (textEntered.length));
    countRemaining = document.getElementById('charactersRemaining');
    countRemaining.textContent = counter;
}
count = document.getElementById('biography');
count.addEventListener('keyup', countCharacters, false);

    FYSCloud.API.queryDatabase(
        "SELECT * FROM user"
    ).done(function (data) {
        console.log(data);
        generateProfileDisplay(data);
    }).fail(function () {
        alert("paniek");
    });

function generateProfileDisplay(data) {
    let userData = data[0];

    let username = userData.username == null ? "" : userData.username;
    let firstname = userData.firstname == null ? "" : userData.firstname;
    let lastname = userData.lastname == null ? "" : userData.lastname;
    let gender = userData.gender == null ? "" : userData.gender;

    let date = new Date(userData.date_of_birth);
    let dob = userData.date_of_birth == null ? "" : `${date.getDay()}-${date.getMonth() + 1}-${date.getFullYear()}`;

    let ageBerekening = new Date().getFullYear() - date.getFullYear();
    console.log(ageBerekening);
    let age = userData.date_of_birth == null ? "" : ageBerekening;

    let interests = userData.interests == null ? "" : userData.interests;

    let biography = userData.biography == null ? "" : userData.biography;

    let email = userData.email == null ? "" : userData.email;

    let tel = userData.tel == null ? "" : userData.tel;

    let destination = userData.destination == null ? "" : userData.destination;

    date = new Date(userData.start_date);
    let start_date = userData.start_date == null ? "" : `${date.getDay()}-${date.getMonth() + 1}-${date.getFullYear()}`;

    date = new Date(userData.end_date);
    let end_date = userData.end_date == null ? "" : `${date.getDay()}-${date.getMonth() + 1}-${date.getFullYear()}`;

    let buddy = userData.lookingfor == null ? "" : userData.lookingfor;

    $("#username").html("<b>Username: </b>" + username);
    $("#usernameTitle").html(username);
    $("#firstname").html("<b>First name: </b>" + firstname);
    $("#lastname").html("<b>Last name: </b>" + lastname);
    $("#gender").html(gender);
    $("#age").html("<b>Age: </b>" + age);
    $("#dob").html("<b>Date of birth: </b>" + dob);
    $("#badge1").html(interests);

    $("#biography").html(biography);
    $("#email").html("<b>E-mail: </b>" + email);
    $("#tel").html("<b>Tel: </b>" + tel);
    $("#destination").html("<b>Destination: </b>" + destination);
    $("#from").html("<b>From: </b>" + start_date);
    $("#untill").html("<b>Untill: </b>" + end_date);
    $("#lookingFor").html("<b>I am looking for: </b>" + buddy);

    // TODO: test the user's gender and interests with data from database.
    //let gendertest = userData.gender;
    // if(gendertest.val("Female")) {
    //     let test = $("#female").attr("checked", true);
    //     console.log(test);
    //}
}
    var profileTranslation = {
        profile: {
            username: {
                nl: "<b>Gebruikersnaam: </b>",
                en: "<b>Username:</b> "
            },
            firstname: {
                nl: "<b>Voornaam: </b>",
                en: "<b>First name: </b>"
            },
            lastname: {
                nl: "<b>Achternaam: </b>",
                en: "<b>Last name: </b>"
            },
            gender: {
                nl: "<b>Geslacht</b>",
                en: "<b>Gender</b>"
            },
            age: {
                nl: "<b>Leeftijd: </b>",
                en: "<b>Age: </b>"
            },
            dob: {
                nl: "<b>Geboortedatum: </b>",
                en: "<b>Date of Birth: </b>"
            },
            destination: {
                nl: "<b>Bestemming: </b>",
                en: "<b>Destination: </b>"
            },
            from: {
                nl: "<b>Van: </b>",
                en: "<b>From: </b>"
            },
            untill: {
                nl: "<b>Tot</b>",
                en: "<b>Untill: </b>"
            },
            lookingfor: {
                nl: "<b>Opzoek naar: </b>",
                en: "<b>I am looking for: </b>"
            }

        }

    };

$(function () {
    FYSCloud.Localization.CustomTranslations.addTranslationJSON(profileTranslation);
});

// TODO: make translation language dynamic.
// document.addEventListener("languageChangeEvent", function (event) {
//     console.log(event.detail.id);
//     let newString = FYSCloud.Localization.Buddy.addTranslationJSON("profile.username");
//     newString = newString.replace("");
// });