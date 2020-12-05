let users;

function validationCheck() {
    var emailInput = document.getElementById("e-mail").value;
    var passwordInput = document.getElementById("password").value;

    FYSCloud.API.queryDatabase(
        "SELECT * FROM user WHERE `email` = ?",
        [emailInput]
    ).done(function(data) {
        for (let i = 0; i < data.length; i++) {
            if(emailInput == data[i].email && passwordInput == data[i].password) {
                loginUser(data[i].userId)
                console.log(data[i].userName + ' is logged in!')
            }else {
                console.log("incorrect email or password")
                return false;
            }
        }
    })
}