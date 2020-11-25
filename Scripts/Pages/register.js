let currentStep = 0
showTab(currentStep)

function showTab(number) {
    const step = document.getElementsByClassName("step")

    const MAX_STEP = 2
    const MIN_STEP = 0

    step[number].style.display = "block"

    swapNav(number)

    if (currentStep === MIN_STEP) {
        document.getElementById('btn-back').style.display = 'none'
    } else {
        document.getElementById('btn-back').style.display = 'inline'
    }

    if (currentStep < MAX_STEP) {
        document.getElementById('btn-next').style.display = 'inline'
        document.getElementById('btn-register').style.display = 'none'
    } else {
        document.getElementById('btn-next').style.display = 'none'
        document.getElementById('btn-register').style.display = 'inline'
    }
}

function swapStep(number) {
    let step = document.getElementsByClassName('step')

    if (number === 1 && !validateForm()) return false;

    step[currentStep].style.display = "none"
    currentStep = currentStep + number

    showTab(currentStep)
    console.log(currentStep)
}


function swapNav(number) {
    let i, step = document.getElementsByClassName("nav-step");
    for (i = 0; i < step.length; i++) {
        step[i].className = step[i].className.replace("active", "")
    }
    step[number].className = "active nav-step"
}

function validateForm() {
    let step, input, i, valid = true;
    step = document.getElementsByClassName("step");
    input = step[currentStep].getElementsByTagName("input");

    for (i = 0; i < input.length; i++) {
        if (input[i].value === "") {
            input[i].className += " invalid";
            valid = false;
        }
    }
    if (valid) {
        document.getElementsByClassName("step")[currentStep].className += " finish";
    }
    return valid;
}

function countChars(countFrom, displayTo) {
    document.getElementById(displayTo).innerHTML = document.getElementById(countFrom).value.length;
}

// Get the current year month and date and put it inside of maximum and minimum attributes of DoB input
const MIN_AGE = 18
const MAX_AGE = 100
var dateYear = new Date().getFullYear()
var dateMonth = new Date().getMonth() + 1
var dateDate = new Date().getDate()
var minimumAgeDate = dateYear - MIN_AGE + '-' + dateMonth + '-' + dateDate
var maximumAgeDate = dateYear - MAX_AGE + '-' + dateMonth + '-' + dateDate

document.getElementById('DoB').setAttribute('max', minimumAgeDate)
document.getElementById('DoB').setAttribute('min', maximumAgeDate)