function changeButton() {
    document.getElementById('match').value = "Requested";
}

function changeButton2() {
    document.getElementById('block').value = "Blocked";
}

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
//document.getElementById("dateOfBirth").setAttribute("max", today);
//document.getElementById("dateOfBirth").setAttribute("min", ageCheck);

let count;
function countCharacters() {
    var textEntered, countRemaining, counter;
    textEntered = document.getElementById('biography').value;
    counter = (500- (textEntered.length));
    countRemaining = document.getElementById('charactersRemaining');
    countRemaining.textContent = counter;
}
count = document.getElementById('biography');
//count.addEventListener('keyup', countCharacters, false);

$(function () {
    main();
})

function main() {
    FYSCloud.API.queryDatabase(
        "SELECT * FROM user"
    ).done(function (data) {
        console.log(data);
        let template = $("#databases").html();

        for (let i = 0; i < data.length; i++) {
            let databases = $(template);
            let databases2 = data[i];

            //databases.find(".gebruikersnaam").text(databases.username)
            $(".databases2").append(databases);
        }
    }).fail(function () {
        alert("paniek");
    });
}
// FYSCloud.API.queryDatabase(
//     "SELECT * FROM user"
// ).done(function(data) {
//     console.log(data);
// }).fail(function(reason) {
//     console.log(reason);
// });