function redirectBack() {
    location.href='index.html';
}

function emailValidation() {
    let emailInput = document.getElementById("recovery-email").value;
    FYSCloud.API.queryDatabase(
        "SELECT * FROM user WHERE email = ?",
        [emailInput]
    ).done(function(data) {
        console.log(data.length)
        if(data.length > 0){
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                FYSCloud.API.sendEmail({
                    from: {
                        name: "Group",
                        address: "group@fys.cloud"
                    },
                    to: [
                        {
                            name: data[i].username,
                            address: data[i].email
                        }
                    ],
                    subject: "password recovery " + data[i].email,
                    html: `<h1>Hello User </h1> <p>please click on the following link to reset your password</p> <a href="https://is111-1.fys.cloud/recovery.html?id=${data[i].id}"><p>Password recovery link</p></a>`
                    }).done(function(data) {
                        alert("recovery mail has been send");
                    }).fail(function(reason) {
                        console.log(reason);
                    });
                }
        }else{
        alert("No email found.\nPlease make sure you are using the right e-mail address");
        $('#recovery-email').focus();
        }
    });
}