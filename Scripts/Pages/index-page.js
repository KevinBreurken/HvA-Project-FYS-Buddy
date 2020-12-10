let users;

function validationCheck() {
    var emailInput = document.getElementById("e-mail").value;
    var passwordInput = document.getElementById("password").value;
    var mailformat = /^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/;

    if(emailInput.match(mailformat)){
        alert("succes");
        document.login-form.e-mail.focus();
        FYSCloud.API.queryDatabase(
            "SELECT * FROM user WHERE `email` = ?",
            [emailInput]
        ).done(function(data) {
            for (let i = 0; i < data.length; i++) {
                if(emailInput == data[i].email && passwordInput == data[i].password) {
                    loginUser(data[i].id);
                    console.log(data[i].username + ' is logged in!')
                } else {
                    alert("The email adress or password were incorrect");
                    document.login-form.e-mail.focus();
                    return false;
                }
            }
        })
    }
    else{
        alert("The email adress or password were incorrect");
        document.login-form.e-mail.focus();
        return false;
    }
    
}