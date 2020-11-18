function changeButton() {
    document.getElementById('match').value = "Requested";
}

function changeButton2() {
    document.getElementById('block').value = "Blocked";
}

const MIN_AGE = 18;
const MAX_AGE = 120;
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


document.getElementById("dateOfBirth").setAttribute("max", today);
document.getElementById("dateOfBirth").setAttribute("min", ageCheck);