let female = document.getElementById("Female");
let male = document.getElementById("Male");
let other = document.getElementById("Other");

let travel = document.getElementById("Choice1");
let activity = document.getElementById("Choice2");

let gender
let buddy
let userId = getCurrentUserID();

const MIN_AGE = 18;
const MAX_AGE = 100;

let today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1;
let yyyy = today.getFullYear() - MIN_AGE;
today = yyyy + '-' + mm + '-' + dd;

let ageCheck = new Date();
let day = ageCheck.getDate();
let month = ageCheck.getMonth() + 1;
let year = ageCheck.getFullYear() - MAX_AGE;
ageCheck = year + '-' + month + '-' + day;

let characterLeftText;

document.getElementById("DateOfBirth").setAttribute("max", parseDateToInputDate(today));
document.getElementById("DateOfBirth").setAttribute("min", parseDateToInputDate(ageCheck));

function countCharacters() {
    let textEntered, countRemaining, counter;
    textEntered = document.getElementById('Biography').value;
    counter = (500 - (textEntered.length));
    countRemaining = document.getElementById('charactersRemaining');

    if(characterLeftText === undefined)
        characterLeftText = CustomTranslation.getStringFromTranslations("edit.bioinput");
    countRemaining.textContent = characterLeftText.replace("%amount", counter);

    count = document.getElementById('Biography');
    count.addEventListener('keyup', countCharacters, false);
}

let interestId = new Array();
window.addEventListener('load', function () {
    populateCityList();

})

async function populateCityList() {
    let cityList = await getDataByPromise("SELECT * FROM location");
    $(cityList).each(city => {
        $("#cityList").append(`<option value=${cityList[city]["id"]}>` + cityList[city]["destination"] + `</option>`);
    });
    FYSCloud.API.queryDatabase(
        "SELECT * FROM `travel` WHERE `userId` = ?;",
        [userId]
    ).done(function (data) {
        if (data.length === 0) {
            return;
        }
        let userData = data[0];
        let locatie = userData.locationId;
        let lijst = document.getElementById("cityList");
        lijst.selectedIndex = locatie - 1;
    }).fail(function (reason) {
    });
}

/**
 * When the user edits a field the validation starts.
 */
$(document).on("change", "body", function () {
    let error_username = false;
    let error_firstname = false;
    let error_lastname = false;
    let error_email = false;
    let error_tel = false;
    let error_buddy = false;

    $("#Username").focusout(function () {
        check_username();
    });
    $("#FirstName").focusout(function () {
        check_firstname();
    });
    $("#LastName").focusout(function () {
        check_lastname();
    });
    $("#DateOfBirth").focusout(function () {
        check_lastname();
    });
    $("#Email").focusout(function () {
        check_email();
    });
    $("#Telephone").focusout(function () {
        check_tel();
    });
    $("#lookingFor").focusout(function () {
        check_buddy();
    });

    function check_username() {
        let pattern = /^[a-zA-Z\s\d]*$/;
        let username = $("#Username").val();
        if (pattern.test(username) && username !== '') {
            $("#username_error_message").hide();
            $("#Username").css("border", "2px solid #34F458")
        } else {
            $("#username_error_message").html("<br> Username is not valid")
            $("#username_error_message").show();
            $("#Username").css("border", "2px solid #F90A0A");
            error_username = true;
        }
    }

    function check_firstname() {
        let pattern = /^[a-zA-Z\s]{1,25}$/;
        let firstname = $("#FirstName").val();
        if (pattern.test(firstname) && firstname !== '') {
            $("#firstname_error_message").hide();
            $("#FirstName").css("border", "2px solid #34F458")
        } else {
            $("#firstname_error_message").html("<p style='color: #d81e05'>First name is not valid</p>")
            $("#firstname_error_message").show();
            $("#FirstName").css("border", "2px solid #F90A0A");
            error_firstname = true;
        }
    }

    function check_lastname() {
        let pattern = /^[a-zA-Z\s]{1,25}$/;
        let lastname = $("#LastName").val();
        if (pattern.test(lastname) && lastname !== '') {
            $("#lastname_error_message").hide();
            $("#LastName").css("border", "2px solid #34F458");
        } else {
            $("#lastname_error_message").html("<br> <p style='color: #d81e05'>Last name is not valid</p>")
            $("#lastname_error_message").show();
            $("#LastName").css("border", "2px solid #F90A0A");
            error_lastname = true;
        }
    }

    function check_email() {
        let pattern = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
        let email = $("#Email").val();
        if (pattern.test(email) && email !== '') {
            $("#email_error_message").hide();
            $("#Email").css("border", "2px solid #34F458");
        } else {
            $("#email_error_message").html("<p style='color: #d81e05'>Email is not valid</p><br>")
            $("#email_error_message").show();
            $("#Email").css("border", "2px solid #F90A0A");
            error_email = true;
        }
    }

    function check_tel() {
        let pattern = /^\d{10}$/;
        let tel = $("#Telephone").val();
        if (pattern.test(tel) && tel !== '') {
            $("#tel_error_message").hide();
            $("#Telephone").css("border", "2px solid #34F458");
        } else {
            $("#tel_error_message").html("<p style='color: #d81e05'>Telephone number is not valid</p><br>")
            $("#tel_error_message").show();
            $("#Telephone").css("border", "2px solid #F90A0A");
            error_tel = true;
        }
    }
    function check_buddy() {
        if ($("#Choice1").checked === false && $("#Choice2").checked === false) {
            error_buddy = true;
        } else {
            error_buddy = false;
        }
    }

    /**
     * When the user clicks on the save changes button, the document checks on any invalid input.
     * If the user's input is invalid, the form won't be submitted and the user won't be redirected to their profile page.
     */
    document.getElementById("saveChangesBtn").addEventListener("click", function (event) {
            if(error_username === false &&
                error_firstname === false &&
                error_lastname === false &&
                error_email === false &&
                error_tel === false &&
                error_buddy === false) {

                event.preventDefault();
                let firstname = document.querySelector("#FirstName").value;
                let lastname = document.querySelector("#LastName").value;
                let biography = document.querySelector("#Biography").value;
                let tel = document.querySelector("#Telephone").value;
                if (female.checked === true) {
                    gender = "female";
                } else if (male.checked === true) {
                    gender = "male";
                } else if (other.checked === true) {
                    gender = "other";
                }

                if (travel.checked === true && activity.checked === true) {
                    buddy = 1;
                } else if (activity.checked === true) {
                    buddy = 2;
                } else {
                    buddy = 3;
                }
                let dob = new Date($('#DateOfBirth').val());
                let dobFormat = dob.getFullYear() + "-" + (dob.getMonth() + 1) + "-" + dob.getDate()
                let email = document.querySelector("#Email").value;
                let username = document.querySelector('#Username').value;
                let citySelect = document.getElementById("cityList").value;
                let start = new Date($('#Data').val());
                let startFormat = parseDateToInputDate(start);

                let end = new Date($('#Data2').val());
                let endFormat = parseDateToInputDate(end);


                let interest1 = document.getElementById("interest1").checked;
                let interest2 = document.getElementById("interest2").checked;
                let interest3 = document.getElementById("interest3").checked;
                let interest4 = document.getElementById("interest4").checked;
                let interest5 = document.getElementById("interest5").checked;
                let interest6 = document.getElementById("interest6").checked;
                let interest7 = document.getElementById("interest7").checked;
                let interest8 = document.getElementById("interest8").checked;
                let interest9 = document.getElementById("interest9").checked;
                let interest10 = document.getElementById("interest10").checked;

                FYSCloud.API.queryDatabase(
                    "UPDATE `profile` SET `firstname` = ?, `lastname` = ?, `gender` = ?, `dob` = ?, `biography` = ?, `phone` = ?, `buddyType` = ? WHERE `userId` = ?;",
                    [firstname, lastname, gender, dobFormat, biography, tel, buddy, userId]
                ).done(function (data) {
                    redirectToProfileById(userId);
                }).fail(function (reason) {
                    FYSCloud.API.queryDatabase(
                        "INSERT INTO `profile` (`userId`, `phone`, `biography`) VALUES (?, ?, ?)",
                        [userId, tel, biography]
                    ).done(function (data) {
                        redirectToProfileById(userId);
                    }).fail(function (reason) {
                    });
                });

                FYSCloud.API.queryDatabase(
                    "UPDATE `user` SET `email` = ?, `username` = ? WHERE `id` = ?;",
                    [email, username, userId]
                ).done(function (data) {
                    redirectToProfileById(userId);
                }).fail(function (reason) {
                });


                FYSCloud.API.queryDatabase(
                    "INSERT INTO `travel` (`id`,`userId`,`locationId`,`startdate`, `enddate`) VALUES (NULL, ?, ?, ?, ?);",
                    [userId, citySelect, startFormat, endFormat]
                ).done(function (data) {
                    redirectToProfileById(userId);
                }).fail(function (reason) {
                    FYSCloud.API.queryDatabase(
                        "UPDATE `travel` SET `locationId` = ?,`startdate` = ?, `enddate` = ? WHERE userId = ?;",
                        [citySelect, startFormat, endFormat, userId]
                    ).done(function (data) {
                        redirectToProfileById(userId);
                    }).fail(function (reason) {
                    });
                });

                FYSCloud.API.queryDatabase(
                    "SELECT * FROM `userinterest` WHERE userId = ?;", [userId]
                ).done(function (data) {
                    if (data.length === 0) {
                        return;
                    }
                    let interestId = new Array();
                    let interest = new Array();
                    interest.push(interest1, interest2, interest3, interest4, interest5,
                        interest6, interest7, interest8, interest9, interest10);
                    for (let i = 0; i < interest.length; i++) {
                        if (interest[i] === true) {
                            interestId.push((i + 1));
                        }
                    }
                    for (let i = 0; i < interestId.length; i++) {
                        FYSCloud.API.queryDatabase(
                            "INSERT INTO `userinterest` (`userId`, `interestId`) VALUES (?, ?);",
                            [userId, interestId[i]]
                        ).done(function (data) {
                            redirectToProfileById(userId);
                        }).fail(function (reason) {
                        });
                    }
                }).fail(function () {
                    alert("paniek");
                    let interestId = new Array();
                    let interest = new Array();
                    interest.push(interest1, interest2, interest3, interest4, interest5,
                        interest6, interest7, interest8, interest9, interest10);
                    for (let i = 0; i < interest.length; i++) {
                        if (interest[i] === true) {
                            interestId.push((i + 1));
                        }
                    }
                    for (let i = 0; i < interestId.length; i++) {
                        FYSCloud.API.queryDatabase(
                            "INSERT INTO `userinterest` (`userId`, `interestId`) VALUES (?, ?);",
                            [userId, interestId[i]]
                        ).done(function (data) {
                            redirectToProfileById(userId);
                        }).fail(function (reason) {
                        });
                    }
                });

                FYSCloud.API.queryDatabase(
                    "SELECT * FROM `userinterest` where userId = ?", [userId]
                ).done(function (data) {
                    if (data.length === 0) {
                        return;
                    }
                    let interestId2 = new Array();
                    let interest = new Array();
                    interest.push(interest1, interest2, interest3, interest4, interest5,
                        interest6, interest7, interest8, interest9, interest10);
                    for (let i = 0; i < interest.length; i++) {
                        if (interest[i] === false) {
                            interestId2.push(i + 1)
                        }
                    }
                    for (let i = 0; i < interestId2.length; i++) {
                        FYSCloud.API.queryDatabase(
                            "DELETE FROM `userinterest` WHERE `userId` = ? AND `interestId` = ?;",
                            [userId, interestId2[i]]
                        ).done(function (data) {
                            redirectToProfileById(userId);
                        }).fail(function (reason) {
                        });
                    }
                }).fail(function () {
                    alert("paniek");
                });
            } else {
                event.preventDefault();
            }
        });
});

/**
 * Get all the data from the database and fill all the input fields.
 */
FYSCloud.API.queryDatabase(
    "SELECT * FROM user where id = ?", [userId]
).done(function (data) {
    if (data.length === 0) {
        return;
    }
    let userData = data[0];
    $("#Email").val(userData.email);
    $("#Username").val(userData.username);
}).fail(function () {
    alert("paniek");
});

FYSCloud.API.queryDatabase(
    "SELECT * FROM profile where userId = ?", [userId]
).done(function (data) {
    if (data.length === 0) {
        return;
    }
    let userData = data[0];
    let url = userData.pictureUrl === "" ? `${environment}/uploads/profile-pictures/default-profile-picture.png` : userData.pictureUrl;
    let dob = parseDateToInputDate(userData.dob);
    $("#DateOfBirth").val(dob);

    let gendertest = userData.gender;
    if (gendertest === "male") {
        document.getElementById("Male").checked = true;
    } else if (gendertest === "female") {
        document.getElementById("Female").checked = true;
    } else {
        document.getElementById("Other").checked = true;
    }

    let buddytest = userData.buddyType;
    if (buddytest === 1) {
        document.getElementById("Choice1").checked = true;
        document.getElementById("Choice2").checked = true;
    } else if (buddytest === 2) {
        document.getElementById("Choice2").checked = true;
    } else if (buddytest === 3) {
        document.getElementById("Choice1").checked = true;
    }
    $("#imagePreview").attr("src",  `${environment}/uploads/profile-pictures/` + url);
    $("#FirstName").val(userData.firstname);
    $("#LastName").val(userData.lastname);
    $("#Biography").val(userData.biography);
    countCharacters();
    $("#Telephone").val(userData.phone);
}).fail(function () {
    alert("paniek");
});

FYSCloud.API.queryDatabase(
    "SELECT `startdate`, `enddate` FROM `travel` WHERE userId = ?", [userId]
).done(function (data) {
    if (data.length === 0) {
        return;
    }
    let userData = data[0];
    let startdate = parseDateToInputDate(userData.startdate);
    $("#Data").val(startdate);
    let enddate = parseDateToInputDate(userData.enddate);
    $("#Data2").val(enddate);
}).fail(function () {
    alert("paniek");
});

FYSCloud.API.queryDatabase(
    "SELECT * FROM `userinterest` where userId = ?", [userId]
).done(function (data) {
    for (let i = 0; i < data.length; i++) {
        if (data.length === 0) {
            return;
        }
        let userData = data[i];
        if (userData.interestId === 1) {
        document.getElementById("interest1").checked = true;
        }
        if (userData.interestId === 2) {
        document.getElementById("interest2").checked = true;
        }
        if (userData.interestId === 3) {
            document.getElementById("interest3").checked = true;
        }
        if (userData.interestId === 4) {
            document.getElementById("interest4").checked = true;
        }
        if (userData.interestId === 5) {
            document.getElementById("interest5").checked = true;
        }
        if (userData.interestId === 6) {
            document.getElementById("interest6").checked = true;
        }
        if (userData.interestId === 7) {
            document.getElementById("interest7").checked = true;
        }
        if (userData.interestId === 8) {
            document.getElementById("interest8").checked = true;
        }
        if (userData.interestId === 9) {
            document.getElementById("interest9").checked = true;
        }
        if (userData.interestId === 10) {
            document.getElementById("interest10").checked = true;
        }
    }
}).fail(function () {
    alert("paniek");
});

/**
 * When there are no changes made at the profile page, redirect the user to their profile page.
 */
$("#saveChangesBtn").on("click",function () {
    $("#saveChangesBtn").attr("type", "button");
    redirectToProfileById(userId);
})

/**
 * Preview profile image and update profile image
 */
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

    FYSCloud.Utils
        .getDataUrl($("#fileUpload"))
        .done(function (data) {
            let profileImageUrl = "profile-pictures/pp-" + userId + "." + data.extension;
            FYSCloud.API.deleteFile(profileImageUrl).done(function (data) {
            }).fail(function (reason) {
            });
            let url = "pp-" + userId + "." + data.extension
            FYSCloud.API.uploadFile(
                "profile-pictures/pp-" + userId + "." + data.extension,
                data.url,
            ).done(function (data) {
                FYSCloud.API.queryDatabase(
                    "UPDATE `profile` SET `pictureUrl` = ? WHERE `profile`.`userId` = ?;",
                    [url, userId]
                ).done(function (data) {
                }).fail(function (reason) {
                });
            }).fail(function (reason) {
            });
        }).fail(function(reason) {
    });
})

/**
 * Change the language on biography section when language is changed.
 */
document.addEventListener("languageChangeEvent", function (event) {
    characterLeftText = CustomTranslation.getStringFromTranslations("edit.bioinput");
    countCharacters();
});
