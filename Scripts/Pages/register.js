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

step[currentStep].style.display = 'flex'

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
            if (username !== "" && username.length <= MAX_USERNAME) {
                if(email !== "" && email.length <= MAX_EMAIL) {
                    if(password !== "" && password.length <= MAX_PASSWORD) {
                        if(password === passwordRepeat) {
                            // Hides the current step and will display the next step
                            step[currentStep].style.display = 'none';
                            step[currentStep + number].style.display = 'block';
                            currentStep += number;
                        }
                        else {
                            alert("Entered password and repeated password do not match. Please re-enter and try again.");
                        }
                    }
                    else {
                        //alert("Password was left empty or exceeded character limit of " + MAX_PASSWORD + " characters.");
                    }
                }
                else {
                    //alert("Email was left empty or exceeded character limit of " + MAX_EMAIL + " characters.");
                }
            }
            else {
                //alert("Username was left empty or exceeded character limit of " + MAX_USERNAME + " characters.");
            }

            console.log("current step is: " + currentStep);
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
            if(firstname !== "") {
                if(firstname.length <= MAX_FIRSTNAME) {
                    if(lastname !== "") {
                        if(lastname.length <= MAX_LASTNAME) {
                            if(dob !== "") {
                                if(dob <= dateMin && dob >= dateMax) {
                                    if((gender === "male" || gender === "female" || gender === "other")) {
                                        // Hides the current step and will display the next step
                                        step[currentStep].style.display = 'none'
                                        step[currentStep + number].style.display = 'block'
                                        currentStep += number
                                    }
                                    else {
                                        //alert("No gender was selected. Please re-enter and try again.");
                                    }
                                }
                                else {
                                    //alert("Date of birth field exceeded date limit of " + dateMin + " or " + dateMax +  ". Please re-enter and try again.");
                                }
                            }
                            else {
                                //alert("Date of birth field was left empty. Please re-enter and try again.");
                            }
                        }
                        else {
                            //alert("Last name field exceeded character limit of " + MAX_LASTNAME + " characters. Please re-enter and try again.");
                        }
                    }
                    else {
                        //alert("Last name field was left empty. Please re-enter and try again.");
                    }
                }
                else {
                    //alert("First name field exceeded character limit of " + MAX_FIRSTNAME + " characters. Please re-enter and try again.")
                }
            }
            else {
                //alert("First name field was left empty. Please re-enter and try again.");
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
        if((currentStep + number) === 0) {
            step[currentStep + number].style.display = 'flex'
        }
        else {
            step[currentStep + number].style.display = 'block'
        }
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



addInputEventListeners();
function addInputEventListeners() {
    let registerForm = document.getElementById("registerForm");
    let inputFields = registerForm.getElementsByTagName("input");
    for (let i = 0; i < inputFields.length; i++) {
        if (inputFields[i].getAttribute("type") === "text" ||
            inputFields[i].getAttribute("type") === "password" ||
            inputFields[i].getAttribute("type") === "email" ||
            inputFields[i].getAttribute("type") === "date" ||
            inputFields[i].getAttribute("type") === "file") {
            inputFields[i].addEventListener("keyup", function(e) {
                if(e.key === "Enter") {
                    swapStep(1);
                    fireHtml5FormValidation();
                }
            });
        }
    }

    // TODO: Add enter submition event on textarea enter keypress:
    let textAreas = registerForm.getElementsByTagName("textarea");
    for (let i = 0; i < textAreas.length; i++) {
        //console.log(textAreas[i]);
    }
}

// document.getElementById("btn-back").addEventListener("click", function(e) {
//     e.preventDefault();
//     fireHtml5FormValidation();
// });
document.getElementById("btn-next").addEventListener("click", function(e) {
    e.preventDefault();
    fireHtml5FormValidation();
});
document.getElementById("btn-register").addEventListener("click", function(e) {
    e.preventDefault();
    fireHtml5FormValidation();
});

function fireHtml5FormValidation() {
    let $myForm = $("#registerForm");

    if(! $myForm[0].checkValidity()) {
        // If the form is invalid, submit it. The form won't actually submit;
        // this will just cause the browser to display the native HTML5 error messages.
        $myForm.find('input:submit').click();
    }
}

// Function for the biography input. Writes the amount of used characters in text
function countChars(countFrom, displayTo) {
    document.querySelector("#" + displayTo).innerHTML =
        document.querySelector("#" + countFrom).value.length;
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

let url
let picExtension

function register() {
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

    console.log(email + " " + password + " " + username);

    // TODO: Create an element on an adminstrator only page to add more administrator accounts:
    // Curently only creating "user" role accounts:
    FYSCloud.API.queryDatabase(
        "INSERT INTO `user` (`id`, `email`, `password`, `username`, `userRole`) " +
        "VALUES (NULL, ?, ?, ?, '1')",
        [email, password, username]
    ).done(function (data) {
        setId = data.insertId

        FYSCloud.Utils.getDataUrl($("#fileUpload"))
        .done(function (data) {
            picExtension = data.extension
            url = "pp-" + setId + "." + picExtension

            FYSCloud.API.uploadFile(
                "profile-pictures/pp-" + setId + "." + picExtension,
                data.url,
            ).done(function(data) {
                console.log(data);
            }).fail(function(reason) {
                console.log(reason);
            });

            FYSCloud.API.queryDatabase(
                "INSERT INTO `profile` (`id`, `userId`, `firstname`, `lastname`, `gender`, `dob`, `biography`, `pictureUrl`, `locationId`, `phone`)" +
                "VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, NULL, NULL);" +
                "INSERT INTO setting (`id`, `userId`, `deactivated`, `languageId`, `profileVisibilityId`, `sameGender`, `displayGenderId`, `notifcationId`, `maxDistance`, `radialDistance`)" +
                "VALUES (NULL, ?, '0', '1', '1', '0', '1', '1', '40750', '40750')",
                [setId, firstname, lastname, gender, dobFormat, bio, url, setId, setId]
            ).done(function (data) {
                console.log(data);
                for (let i = 0; i < hobby.length; i++) {
                    FYSCloud.API.queryDatabase(
                        "INSERT INTO `userinterest` (`userId`, `interestId`) VALUES (?, ?)",
                        [setId, hobby[i]]
                    ).done(function(data) {
                        console.log(data);
                        loginUser(setId,"homepage.html?activateOnBoarding");
                    }).fail(function (reason) {
                        console.log(reason);
                    });
                }
            }).fail(function (reason) {
                console.log(reason);
            });
        }).fail(function (reason) {
            console.log(reason);

            FYSCloud.API.queryDatabase(
                "INSERT INTO `profile` (`id`, `userId`, `firstname`, `lastname`, `gender`, `dob`, `biography`, `pictureUrl`, `locationId`, `phone`)" +
                "VALUES (NULL, ?, ?, ?, ?, ?, ?, DEFAULT, NULL, NULL);" +
                "INSERT INTO setting (`id`, `userId`, `deactivated`, `languageId`, `profileVisibilityId`, `sameGender`, `displayGenderId`, `notifcationId`, `maxDistance`, `radialDistance`)" +
                "VALUES (NULL, ?, '0', '1', '1', '1', '1', '1', '11', '500')",
                [setId, firstname, lastname, gender, dobFormat, bio, setId, setId]
            ).done(function (data) {
                console.log(data);

                for (let i = 0; i < hobby.length; i++) {
                    FYSCloud.API.queryDatabase(
                        "INSERT INTO `userinterest` (`userId`, `interestId`) VALUES (?, ?)",
                        [setId, hobby[i]]
                    ).done(function(data) {
                        console.log(data);
                        loginUser(setId,"homepage.html?activateOnBoarding");
                    }).fail(function (reason) {
                        console.log(reason)
                    })
                }
            }).fail(function(reason) {
                console.log(reason);
            });
        });
    }).fail(function (reason) {
        console.log(reason)
    })
}

/* Detect a flex wrap so that the order of flex items might be changed: */
let detectWrap = function(className) {
    let wrappedItems = [];
    let prevItem = {};
    let currItem = {};
    let flexContainers = document.getElementsByClassName(className);
    let items = [];
    for (let i = 0; i < flexContainers.length; i++) {
        for (let j = 0; j < flexContainers[i].children.length; j++) {
            items.push(flexContainers[i].children[j]);
        }
    }

    for (let i = 0; i < items.length; i++) {
        currItem = items[i].getBoundingClientRect();
        if (prevItem && prevItem.top < currItem.top) {
            wrappedItems.push(items[i]);
        }
        prevItem = currItem;
    }

    return wrappedItems;
}

window.onload = function() {
    let flexContainerClassName = "flex-container";
    let flexContainers = document.getElementsByClassName(flexContainerClassName);
    for (let i = 0; i < flexContainers.length; i++) {
        for (let j = 0; j < flexContainers[i].children.length; j++) {
            flexContainers[i].children[j].style.removeProperty("order");
        }
    }

    let wrappedItems = detectWrap(flexContainerClassName);

    // When using space-between:
    // if(wrappedItems.length > 0) {
    //     for (let i = 0; i < flexContainers.length; i++) {
    //         flexContainers[i].style.setProperty("justify-content", "center");
    //
    //         for (let j = 0; j < flexContainers[i].children.length; j++) {
    //             flexContainers[i].children[j].style.setProperty("margin", "0");
    //         }
    //     }
    // }
    // else {
    //     for (let i = 0; i < flexContainers.length; i++) {
    //         flexContainers[i].style.setProperty("justify-content", "space-between");
    //
    //         for (let j = 0; j < flexContainers[i].children.length; j++) {
    //             flexContainers[i].children[j].style.removeProperty("margin");
    //         }
    //     }
    // }

    for (let i = 0; i < wrappedItems.length; i++) {
        wrappedItems[i].style.setProperty("order", "-1");
        wrappedItems[i].style.setProperty("margin-left", "0");
    }
};

window.onresize = function() {
    let flexContainerClassName = "flex-container";
    let flexContainers = document.getElementsByClassName(flexContainerClassName);
    for (let i = 0; i < flexContainers.length; i++) {
        for (let j = 0; j < flexContainers[i].children.length; j++) {
            flexContainers[i].children[j].style.removeProperty("order");
        }
    }

    let wrappedItems = detectWrap(flexContainerClassName);

    // When using space-between:
    // if(wrappedItems.length > 0) {
    //     for (let i = 0; i < flexContainers.length; i++) {
    //         flexContainers[i].style.setProperty("justify-content", "center");
    //
    //         for (let j = 0; j < flexContainers[i].children.length; j++) {
    //             flexContainers[i].children[j].style.setProperty("margin", "0");
    //         }
    //     }
    // }
    // else {
    //     for (let i = 0; i < flexContainers.length; i++) {
    //         flexContainers[i].style.setProperty("justify-content", "space-between");
    //
    //         for (let j = 0; j < flexContainers[i].children.length; j++) {
    //             flexContainers[i].children[j].style.removeProperty("margin");
    //         }
    //     }
    // }

    for (let i = 0; i < wrappedItems.length; i++) {
        wrappedItems[i].style.setProperty("order", "-1");
    }
}