let female = document.getElementById("Female");
let male = document.getElementById("Male");
let other = document.getElementById("Other");

let travel = document.getElementById("Choice1");
let activity = document.getElementById("Choice2");

let gender
let buddy

document.getElementById("saveChangesBtn").addEventListener("click", function (event) {
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

    // TODO: fix profile picture upload.
    // FYSCloud.Utils
    //     .getDataUrl($("#fileUpload"))
    //     .done(function (photoId) {
    //         FYSCloud.API.uploadFile(
    //             "profile-pictures/pp-" + photoId + ".jpg",
    //             data.url
    //         ).fail(function (reason) {
    //             console.log(reason)
    //         })
    //     }).fail(function (reason) {
    //     console.log(reason)
    // })

    FYSCloud.API.queryDatabase(
        "UPDATE `profile` SET `firstname` = ?, `lastname` = ?, `gender` = ?, `dob` = ?, `biography` = ?, `phone` = ?, `buddyType` = ? WHERE `id` = ?;",
        [firstname, lastname, gender, dobFormat, biography, tel, buddy, userId]
    ).done(function (data) {
        console.log(data);
        window.location.href = "profile.html";
    }).fail(function (reason) {
        console.log(reason)
    });

    let email = document.querySelector("#Email").value;
    let username = document.querySelector('#Username').value;

    FYSCloud.API.queryDatabase(
        "UPDATE `user` SET `email` = ?, `username` = ? WHERE `id` = ?;",
        [email, username, userId]
    ).done(function (data) {
        console.log(data);
        window.location.href = "profile.html";
    }).fail(function (reason) {
        console.log(reason)
    });

    let destination = document.querySelector("#Destination").value;

    FYSCloud.API.queryDatabase(
        "UPDATE `location` SET `destination` = ? WHERE `id` = ?;",
        [destination, userId]
    ).done(function (data) {
        console.log(data);
        window.location.href = "profile.html";
    }).fail(function (reason) {
        console.log(reason)
    });

    let start = new Date($('#Data').val());
    let startFormat = start.getFullYear() + "-" + (start.getMonth() + 1) + "-" + start.getDate();

    let end = new Date($('#Data2').val());
    let endFormat = end.getFullYear() + "-" + (end.getMonth() + 1) + "-" + end.getDate();
    FYSCloud.API.queryDatabase(
        "UPDATE `travel` SET `startdate` = ?, `enddate` = ? WHERE `id` = ?;",
        [startFormat, endFormat, userId]
    ).done(function (data) {
        console.log(data);
        window.location.href = "profile.html";
    }).fail(function (reason) {
        console.log(reason)
    });

    // TODO: fix editing interests.
    // var interestId = new Array();
    //     let userData = data[0];
    //     let interest1 = document.getElementById("interest1").checked;
    //     let interest2 = document.getElementById("interest2").checked;
    //     let interest3 = document.getElementById("interest3").checked;
    //     let interest4 = document.getElementById("interest4").checked;
    //     let interest5 = document.getElementById("interest5").checked;
    //     let interest6 = document.getElementById("interest6").checked;
    //     let interest7 = document.getElementById("interest7").checked;
    //     let interest8 = document.getElementById("interest8").checked;
    //     let interest9 = document.getElementById("interest9").checked;
    //     let interest10 = document.getElementById("interest10").checked;
    //
    //     if (interest1 === true) {
    //         interestId.push('1');
    //     }
    //     if (interest2 === true) {
    //         interestId.push('2');
    //     }
    //     if (interest3 === true) {
    //         interestId.push('3');
    //     }
    //     if (interest4 === true) {
    //         interestId.push('4');
    //     }
    //     if (interest5 === true) {
    //         interestId.push('5');
    //     }
    //     if (interest6 === true) {
    //         interestId.push('6');
    //     }
    //     if (interest7 === true) {
    //         interestId.push('7');
    //     }
    //     if (interest8 === true) {
    //         interestId.push('8');
    //     }
    //     if (interest9 === true) {
    //         interestId.push('9');
    //     }
    //     if (interest10 === true) {
    //         interestId.push('10');
    //     }
    //
    //     console.log(interestId);
    //
    // for (let i = 0; i < interestId.length; i++) {
    //     FYSCloud.API.queryDatabase(
    //         "UPDATE `userinterest` SET `interestId` = ? WHERE `id` = ?;",
    //         [interestId[i], userId]
    //     ).done(function (data) {
    //         console.log(data);
    //         window.location.href = "profile.html";
    //     }).fail(function (reason) {
    //         console.log(reason)
    //     });
    // }
});

    FYSCloud.API.queryDatabase(
        "SELECT * FROM user where id = ?", [userId]
    ).done(function (data) {
        console.log(data);
        let userData = data[0];
        $("#Email").val(userData.email);
        $("#Username").val(userData.username);
    }).fail(function () {
        alert("paniek");
    });

    FYSCloud.API.queryDatabase(
        "SELECT * FROM profile where id = ?", [userId]
    ).done(function (data) {
        console.log(data);
        let userData = data[0];
        let url = userData.pictureUrl === "" ? "https://dev-is111-1.fys.cloud/uploads/profile-pictures/default-profile-picture.png" : userData.pictureUrl;
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
            document.getElementById("Choice1").checked = true;
        } else if (buddytest === 3) {
            document.getElementById("Choice2").checked = true;
        }
        $("#imagePreview").attr("src",  "https://dev-is111-1.fys.cloud/uploads/profile-pictures/" + url);
        $("#FirstName").val(userData.firstname);
        $("#LastName").val(userData.lastname);
        $("#Biography").val(userData.biography);
        $("#Telephone").val(userData.phone);
    }).fail(function () {
        alert("paniek");
    });

    FYSCloud.API.queryDatabase(
        "SELECT * FROM location where id = ?", [userId]
    ).done(function (data) {
        console.log(data);
        let userData = data[0];
        $("#Destination").val(userData.destination);
    }).fail(function () {
        alert("paniek");
    });

    FYSCloud.API.queryDatabase(
        "SELECT `startdate`, `enddate` FROM `travel` WHERE id = ?", [userId]
    ).done(function (data) {
        console.log(data);
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
    console.log(data);
     for (let i = 0; i < data.length; i++) {
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
