const MAX_USERNAME = 50
const MAX_EMAIL = 50
const MAX_PASSWORD = 16
const MAX_FIRSTNAME = 25
const MAX_LASTNAME = 25

let username
let email
let password
let passwordRepeat

let firstname
let lastname
let gender
let dob
let dobFormat

let bio
let hobby

// Get the current year month and date and put it inside of maximum and minimum attributes of DoB input
const MIN_AGE = 18
const MAX_AGE = 100
const dateYear = new Date().getFullYear()
const dateMonth = new Date().getMonth()
const dateDate = new Date().getDate()

// Date for input max and min attributes
let minimumAgeDate = dateYear - MIN_AGE + '-' + (dateMonth + 1) + '-' + dateDate
let maximumAgeDate = dateYear - MAX_AGE + '-' + (dateMonth + 1) + '-' + dateDate
document.querySelector('#DoB').setAttribute('max', minimumAgeDate)
document.querySelector('#DoB').setAttribute('min', maximumAgeDate)

// Date for validation statement
let dateMin = new Date(dateYear - MIN_AGE, dateMonth, dateDate)
let dateMax = new Date(dateYear - MAX_AGE, dateMonth, dateDate)

let currentStep = 0
let step = document.getElementsByClassName('step')

step[currentStep].style.display = 'block'

function swapStep(number) {
    // Set all the buttons
    let nextBtn = document.querySelector('#btn-next')
    let backBtn = document.querySelector('#btn-back')
    let registerBtn = document.querySelector('#btn-register')

    // If the user pressed the next button check for each step if input is correct
    if (number === 1) {

        // TODO If something doesn't have correct input change the input to show it's invalid to the user
        // Step 1 Login Details
        if (currentStep === 0) {
            username = document.querySelector('#username').value
            email = document.querySelector('#email').value
            password = document.querySelector('#password').value
            passwordRepeat = document.querySelector('#repeat-password').value

            // Check if nothing is left empty and if it's within the given parameter
            if (username !== "" && username.length <= MAX_USERNAME &&
                email !== "" && email.length <= MAX_EMAIL &&
                password !== "" && password.length <= MAX_PASSWORD && password === passwordRepeat) {

                // Hides the current step and will display the next step
                step[currentStep].style.display = 'none'
                step[currentStep + number].style.display = 'block'
                currentStep += number
            }

            backBtn.style.display = 'none'
            nextBtn.style.display = 'inline'
            registerBtn.style.display = 'none'
        }

        // Step 2 User information
        if (currentStep === 1) {
            firstname = document.querySelector('#firstname').value
            lastname = document.querySelector('#lastname').value
            dob = new Date(document.querySelector('#DoB').value)
            dobFormat = dob.getFullYear() + "-" + (dob.getMonth() + 1) + "-" + dob.getDate()

            let genders = document.getElementsByClassName('gender')
            // Loops through all the available gender options until its hits the user selected option then assigns in to gender variable
            for (let i = 0; i < genders.length; i++) {
                if (genders[i].checked) {
                    gender = genders[i].value
                    break
                }
            }

            // Check if nothing is left empty and if it's within the given parameter
            if (firstname !== "" && firstname.length <= MAX_FIRSTNAME &&
                lastname !== "" && lastname.length <= MAX_LASTNAME &&
                dob !== "" && dob <= dateMin && dob >= dateMax &&
                (gender === "male" || gender === "female" || gender === "other")) {

                // Hides the current step and will display the next step
                step[currentStep].style.display = 'none'
                step[currentStep + number].style.display = 'block'
                currentStep += number
            }

            backBtn.style.display = 'inline'
            nextBtn.style.display = 'inline'
            registerBtn.style.display = 'none'
        }

        // Step 3 interest - No validation needed
        // TODO Add database functionality
        if (currentStep === 2) {
            bio = document.querySelector('#bio').value
            // TODO Get value from all selected boxes
            hobby = "test"

            backBtn.style.display = 'inline'
            nextBtn.style.display = 'none'
            registerBtn.style.display = 'inline'
        }
    } else { // If the user pressed back don't check for valid input and show previous step
        step[currentStep].style.display = 'none'
        step[currentStep + number].style.display = 'block'
        // For clarity: currentStep = currentStep - - -1
        currentStep = currentStep - -number

        if (currentStep === 0) {
            backBtn.style.display = 'none'
            nextBtn.style.display = 'inline'
            registerBtn.style.display = 'none'
        }

        if (currentStep === 1) {
            backBtn.style.display = 'inline'
            nextBtn.style.display = 'inline'
            registerBtn.style.display = 'none'
        }

        if (currentStep === 2) {
            backBtn.style.display = 'inline'
            nextBtn.style.display = 'none'
            registerBtn.style.display = 'inline'
        }
    }
}

// Function for the biography input. Writes the amount of used characters in text
function countChars(countFrom, displayTo) {
    document.querySelector("#" + displayTo).innerHTML =
        document.querySelector("#" + countFrom).value.length
}

// Image preview function from FYS Cloud
let imgLoc;
$("#fileUpload").on("change", function () {
    FYSCloud.Utils.getDataUrl($(this)).done(function (data) {
        //$("#filePreviewResult").html(`${data.fileName} (${data.extension}) => ${data.mimeType} (Is image: ${data.isImage})`)

        if (data.isImage) {
            $("#imagePreview").attr("src", data.url)
        } else {
            $("#imagePreview").attr("src", null,)
        }
    }).fail(function (reason) {
        $("#filePreviewResult").html(reason)
    })
})

// Image upload function from FYS Cloud
function imageUpload(photoId) {
    FYSCloud.Utils
        .getDataUrl($("#fileUpload"))
        .done(function (data) {
            FYSCloud.API.uploadFile(
                "profile-pictures/pp-" + photoId + ".jpg",
                data.url
            ).fail(function (reason) {
                console.log(reason)
            })
        }).fail(function (reason) {
        console.log(reason)
    })
}

function register() {
    FYSCloud.API.queryDatabase(
        "INSERT INTO `user` (`id`, `username`, `email`, `password`) VALUES (NULL, ?, ?, ?)",
        [username, email, password]
    ).done(function (data) {
        let photoId = data.insertId
        imageUpload(photoId)

        FYSCloud.API.queryDatabase(
            "INSERT INTO `profile` (`id`, `firstname`, `lastname`, `gender`, `dob`, `phone`, `biography`, `pictureUrl`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [data.insertId, firstname, lastname, gender, dobFormat, bio, hobby, "pp-" + data.insertId + ".jpg"]
        ).done(function (data) {
            loginUser(data.insertId)
        }).fail(function (reason) {
            console.log(reason)
        })
    }).fail(function (reason) {
        console.log(reason)
    })
}