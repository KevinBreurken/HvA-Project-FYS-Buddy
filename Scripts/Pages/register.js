var statisticsTranslation = {
    register: {
        title: {
            nl: "Welkom bij Corendon. ",
            en: "Welcome at Corendon. "
        },
        subtitle: {
            nl: "Je kan een account hier registreren. ",
            en: "You can register your account here. "
        },
        nav: {
            step1: {
                nl: "1. Login details",
                en: "1. Login details"
            },
            step2: {
                nl: "2. Gebruiker informatie",
                en: "2. User information"
            },
            step3: {
                nl: "3. interesses",
                en: "3. Interests"
            }
        },
        step1: {
            title: {
                nl: "Login details",
                en: "Login details"
            },
            info: {
                title: {
                    nl: "Informatie",
                    en: "Information"
                },
                paragraph: {
                    nl: "Wil je de wereld ontdekken, maar wil je dit niet alleen doen? Corendon Matching biedt een website waarbij je andere reizigers kan vinden met wie je op reis kan. Je wordt op basis van dezelfde interesses met een andere alleenstaande reiziger gematcht. ",
                    en: "Do you want to explore the world, but dont want to do this alone? Find your travel buddy is a website where you can find your travel buddy. You will be matched with another single traveler based on the same interests. "
                }
            },
            username: {
                nl: "Gebruikersnaam *",
                en: "Username *"
            },
            email: {
                nl: "E-mail *",
                en: "Email *"
            },
            password: {
                nl: "Wachtwoord *",
                en: "Password *"
            },
            confirmPassword: {
                nl: "Herhaal wachtwoord *",
                en: "Confirm password *"
            }
        },
        step2: {
            title: {
                nl: "Gebruiker informatie",
                en: "User information"
            },
            firstname: {
                nl: "Voornaam *",
                en: "Firstname *"
            },
            lastname: {
                nl: "Achternaam *",
                en: "Lastname *"
            },
            gender: {
                nl: "Geslacht *",
                en: "Gender *",
                male: {
                    nl: "Man",
                    en: "Male"
                },
                female: {
                    nl: "Vrouw",
                    en: "Female"
                },
                other: {
                    nl: "Anders",
                    en: "Other"
                }
            },
            dob: {
                nl: "Geboortedatum *",
                en: "Date of birth *",
                desc: {
                    nl: "18 jaar of ouder",
                    en: "18 years or older"
                }
            },
            profilePic: {
                nl: "Kies een profiel foto",
                en: "Choose a profile picture"
            }
        },
        step3: {
            title: {
                nl: "Interesses",
                en: "Interests"
            },
            bio: {
                nl: "Biografie",
                en: "Biography",
                chars: {
                    nl: " karakters ingevoerd",
                    en: " characters entered"
                }
            },
            hobbies: {
                nl: "Hobby's",
                en: "Hobbies",
                sport: {
                    nl: "Sport",
                    en: "Sport"
                },
                hiking: {
                    nl: "Wandelen",
                    en: "Hiking"
                },
                cooking: {
                    nl: "Koken",
                    en: "Cooking"
                },
                art: {
                    nl: "Kunst of schilderen",
                    en: "Art or painting"
                },
                museum: {
                    nl: "Musea bezoeken",
                    en: "Museum visiting"
                },
                music: {
                    nl: "Muziek",
                    en: "Music"
                },
                dancing: {
                    nl: "Dansen",
                    en: "Dancing"
                },
                theater: {
                    nl: "Theater bezoeken",
                    en: "Theater visiting"
                },
                partying: {
                    nl: "Feesten",
                    en: "Partying"
                },
                gaming: {
                    nl: "Gamen",
                    en: "Gaming"
                },

            }
        },
        buttons: {
            next: {
                nl: "Volgende",
                en: "Next"
            },
            back: {
                nl: "Terug",
                en: "Back"
            },
            register: {
                nl: "Registreer",
                en: "Register"
            }
        }
    }
}

FYSCloud.Localization.CustomTranslations.addTranslationJSON(statisticsTranslation)
// Temporary dummy database connection - will be removed once moved out of development
FYSCloud.API.configure({
    url: "https://api.fys.cloud",
    apiKey: "fys_is111_1.14Sh6xypTzeSUHD4",
    database: "fys_is111_1_dev_kiet",
    environment: "dev"
})
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
            dobFormat = dob.getFullYear() + "-" + (dob.getMonth()+1) + "-" + dob.getDate()

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

// Upload files function from FYS CLoud
$("#fileUpload").on("change", function () {
    FYSCloud.Utils.getDataUrl($(this)).done(function (data) {
        //$("#filePreviewResult").html(`${data.fileName} (${data.extension}) => ${data.mimeType} (Is image: ${data.isImage})`)

        if (data.isImage) {
            $("#imagePreview").attr("src", data.url)
        } else {

        }
    }).fail(function (reason) {
        $("#filePreviewResult").html(reason)
    })
})

function register() {
    console.log(dobFormat)
    FYSCloud.API.queryDatabase(
        "INSERT INTO `user` (`id`, `username`, `email`, `password`, `firstname`, `lastname`, `gender`, `dob`, `bio`, `hobby`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [username, email, password, firstname, lastname, gender, dobFormat, bio, hobby]
).done(function (data) {
        //location.href = "homepage.html"
    }).fail(function (reason) {
        console.log(reason)
    })
}