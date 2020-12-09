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
                nl: "3. Interesses",
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
                    nl: " /500 karakters ingevoerd",
                    en: " /500 characters entered"
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
let image

let bio
let hobby = []

let setId;

// Get the current year month and date and put it inside of maximum and minimum attributes of DoB input
const MIN_AGE = 18
const MAX_AGE = 100
const dateYear = new Date().getFullYear()
const dateMonth = new Date().getMonth()
const dateDate = new Date().getDate()

// Date for input max and min attributes
let minimumAgeDate = dateYear - MIN_AGE + '-' + (dateMonth + 1) + '-' + dateDate
let maximumAgeDate = dateYear - MAX_AGE + '-' + (dateMonth + 1) + '-' + dateDate
$('#DoB').attr('max', parseDateToInputDate(minimumAgeDate))
$('#DoB').attr('min', parseDateToInputDate(maximumAgeDate))

// Date for validation statement
let dateMin = new Date(dateYear - MIN_AGE, dateMonth, dateDate)
let dateMax = new Date(dateYear - MAX_AGE, dateMonth, dateDate)

let currentStep = 0
let step = $('.step')

step[currentStep].style.display = 'block'

function swapStep(number) {
    // Set all the buttons
    let nextBtn = $('#btn-next')
    let backBtn = $('#btn-back')
    let registerBtn = $('#btn-register')

    // If the user pressed the next button check for each step if input is correct
    if (number === 1) {

        // TODO If something doesn't have correct input change the input to show it's invalid to the user
        // Step 1 Login Details
        if (currentStep === 0) {
            username = $('#username').val()
            email = $('#email').val()
            password = $('#password').val()
            passwordRepeat = $('#repeat-password').val()

            // Check if nothing is left empty and if it's within the given parameter
            if (username !== "" && username.length <= MAX_USERNAME &&
                email !== "" && email.length <= MAX_EMAIL &&
                password !== "" && password.length <= MAX_PASSWORD && password === passwordRepeat) {

                // Hides the current step and will display the next step
                step[currentStep].style.display = 'none'
                step[currentStep + number].style.display = 'block'
                currentStep += number
            }

            backBtn.css('display', 'none')
            nextBtn.css('display', 'inline')
            registerBtn.css('display', 'none')
        }

        // Step 2 User information
        if (currentStep === 1) {
            firstname = $('#firstname').val()
            lastname = $('#lastname').val()
            dob = new Date($('#DoB').val())
            dobFormat = dob.getFullYear() + "-" + (dob.getMonth() + 1) + "-" + dob.getDate()

            let genders = $('.gender')
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

            backBtn.css('display', 'inline')
            nextBtn.css('display', 'inline')
            registerBtn.css('display', 'none')
        }

        // Step 3 interest - No validation needed
        if (currentStep === 2) {
            bio = $('#bio').val()

            let hobbies = $('.hobby')
            // Loops through all the checked hobbies and add them to the array
            let counter = 0
            for (let i = 0; i < hobbies.length; i++) {
                if (hobbies[i].checked) {
                    hobby[counter] = hobbies[i].value
                    counter++
                }
            }

            backBtn.css('display', 'inline')
            nextBtn.css('display', 'none')
            registerBtn.css('display', 'inline')
        }
    } else { // If the user pressed back don't check for valid input and show previous step
        step[currentStep].style.display = 'none'
        step[currentStep + number].style.display = 'block'
        // For clarity: currentStep = currentStep - - -1
        currentStep = currentStep - -number

        if (currentStep === 0) {
            backBtn.css('display', 'none')
            nextBtn.css('display', 'inline')
            registerBtn.css('display', 'none')
        }

        if (currentStep === 1) {
            backBtn.css('display', 'inline')
            nextBtn.css('display', 'inline')
            registerBtn.css('display', 'none')
        }

        if (currentStep === 2) {
            backBtn.css('display', 'inline')
            nextBtn.css('display', 'none')
            registerBtn.css('display', 'inline')
        }
    }
}

// Function for the biography input. Writes the amount of used characters in text
function countChars(countFrom, displayTo) {
    document.querySelector("#" + displayTo).innerHTML =
        document.querySelector("#" + countFrom).value.length
}

// Image preview function from FYS Cloud
$("#fileUpload").on("change", function () {
    FYSCloud.Utils.getDataUrl(
        $(this)
    ).done(function (data) {
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
// TODO Fix file extension somehow
let url
let picExtension

function imageUpload(photoId) {
    FYSCloud.Utils.getDataUrl(
        $("#fileUpload")
    ).done(function (data) {
        picExtension = data.extension
        url = "pp-" + photoId + "." + picExtension

        FYSCloud.API.uploadFile(
            "profile-pictures/pp-" + photoId + "." + picExtension,
            data.url,
            bFalse = true
        ).fail(function (reason) {
            console.log(reason)
        })

    }).fail(function (reason) {
        console.log(reason)
    })
}

let bFalse = false

function register() {
    FYSCloud.API.queryDatabase(
        "INSERT INTO `user` (`id`, `username`, `email`, `password`) VALUES (NULL, ?, ?, ?);",
        [username, email, password]
    ).done(function (data) {
        setId = data.insertId

        if (!bFalse) {
            imageUpload(setId) // 1
            if (bFalse) {
                console.log("2 " + setId)
                console.log("3 " + url)
            }
        }

        FYSCloud.API.queryDatabase(
            "INSERT INTO `profile` (`id`, `userId`, `firstname`, `lastname`, `gender`, `dob`, `biography`, `pictureUrl`, `locationId`, `phone`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL);INSERT INTO setting (id, userId, languageId, profileVisibilityId, displayGenderId, notifcationId, maxDistance, radialDistance) VALUES (?, ?, '1', '1', '1', '1', '11', '500')",
            [setId, setId, firstname, lastname, gender, dobFormat, bio, url, setId, setId]
        ).done(function (data) {
            for (let i = 0; i < hobby.length; i++) {
                FYSCloud.API.queryDatabase(
                    "INSERT INTO `userinterest` (`userId`, `interestId`) VALUES (?, ?)",
                    [setId, hobby[i]]
                ).fail(function (reason) {
                    console.log(reason)
                })
            }
        }).fail(function (reason) {
            console.log(reason)
        })
        //loginUser(setId)
    }).fail(function (reason) {
        console.log(reason)
    })
}