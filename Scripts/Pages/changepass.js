window.addEventListener('load', function () {
    checkUrlHasParameter();
    fetchCurrentUserIdFromUrl();
});


function checkUrlHasParameter() {
    const ID = FYSCloud.URL.queryString("id");
    if(!ID)
    window.location.href = 'index.html';
}

function fetchCurrentUserIdFromUrl() {
    let getUserId = window.location.href.split("=")[1];

    document.querySelector("button#sendbtn").addEventListener("click", function(e) {
        newPasswordValidationcheck(getUserId);
    });
}

function newPasswordValidationcheck(id) {
    let newPassword = document.getElementById("newPassword").value;
    let confPassword = document.getElementById("confPassword").value;
    
    let lowerCaseLettersReg = /[a-z]/g;
    let upperCaseLettersReg = /[A-Z]/g;
    let numbersReg = /[0-9]/g;
    const LENGTH_VAL_REQUIRED = 8;

    FYSCloud.API.queryDatabase(
        "SELECT * FROM `user` WHERE `user`.`id` = ?",
        [id]
    ).done(function(data) {
        console.log(data);
        //check if newpassword doesnt match with existing password
        if(newPassword === data[0].password || typeof newPassword === "undefined") {
            alert("Cant use the same password as new password.");
            return;
        }
        if(newPassword !== confPassword){
            alert("Make sure the passwords are the same.");
            return;
        }
        if(!newPassword.match(lowerCaseLettersReg)){
            alert("Make sure your new password at least uses the following elements:\n -lowercase\n -uppercase\n -minimum length of 8 characters");
            return;
        }
        if(!newPassword.match(upperCaseLettersReg)){
            alert("Make sure your new password at least uses the following elements:\n -lowercase\n -uppercase\n -minimum length of 8 characters");
            return;
        }
        if(!newPassword.match(numbersReg)) {
            alert("Make sure your new password at least uses the following elements:\n -lowercase\n -uppercase\n -minimum length of 8 characters");
            return;
        }
        if(newPassword.length < LENGTH_VAL_REQUIRED) {
            console.log("im here");
                alert("Make sure your new password at least uses the following elements:\n -lowercase\n -uppercase\n -minimum length of 8 characters");
                return;
        }else {
            FYSCloud.API.queryDatabase(
                "UPDATE `user` SET `password` = ? WHERE id = ?",
                [newPassword, id]
                ).done(function(data) {
                    alert("Succesfully updated your new password");
                    location.href='index.html';
                });
        }
    }).fail(function(reason) {
        console.log(reason);
    });
}