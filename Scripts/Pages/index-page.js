let emlInput = document.querySelector("#e-mail");
let regx = /[@]/g;


emlInput.addEventListener('input', function(e) {
let validationContainer = document.querySelector("#validationMessage");
let monkeyVal = document.querySelector("#monkeytailVal");
if(this.value === "") {
    validationContainer.style.display = "none";
}
else {
    validationContainer.style.display = "block";

}

if(this.value.match(regx)){ // little check if user has @ in email input field
    monkeyVal.classList.remove("invalid");
    monkeyVal.classList.add("valid");
}else{
    monkeyVal.classList.remove("valid");
    monkeyVal.classList.add("invalid");
}
});

function validationCheck() {
    let emailInput = document.getElementById("e-mail").value;
    let passwordInput = document.getElementById("password").value;
    //mail format checker
    var mailformat = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)$/g;

    if(emailInput == "" || passwordInput == ""){ // check if every input has been filled in
        alert('please fill in your email and password');
        return false;
    }else{
        if(emailInput.match(mailformat)){ // format check on email
            FYSCloud.API.queryDatabase(
                "SELECT * FROM user WHERE `email` = ?",
                [emailInput]
            ).done(function(data) {
                if(data.length == 0)
                    alert("No e-mail found");
                else {
                    for (let i = 0; i < data.length; i++) {
                        if (emailInput == data[i].email && passwordInput == data[i].password) {
                            loginUser(data[i].id);
                            console.log(data[i].username + ' is logged in!')
                        } else {
                            alert("Email or password are incorrect");
                            document.login - form.e - mail.focus();
                            return false;
                        }
                    }
                }
            })
        }
        else{
            alert("Email or password are incorrect");
            return false;
        }
    }
}

document.getElementById("signIn").addEventListener("click", function(e) {
   e.preventDefault();
   validationCheck();
});
