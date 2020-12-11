var recoveryTranslations = {
    recovery: {
        password: {
            nl: `Wachtwoord herstellen`,
            en: `Recover password`
        },
        login: {
            nl: "Login",
            en: "Login"
        },
        validationcontain: {
            nl: "Je email moet het volgende bevatten",
            en: "E-mail must contain the following"
        },
        forgotpass: {
            nl: "Forgot your password?",
            en: "Wachtwoord vergeten?"
        },
    },

};
FYSCloud.Localization.CustomTranslations.addTranslationJSON(recoveryTranslations);

function emailValidation() {
    var emailInput = document.getElementById("recovery-email").value;
    FYSCloud.API.queryDatabase(
        "SELECT * FROM user WHERE email = ?",
        [emailInput]
    ).done(function(data) {

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
            html: "<h1>Hello User </h1> <p>please click on the following link to reset your password</p> <a href='http://127.0.0.1:5500/recovery.html'>Password recovery link</a>"
            }).done(function(data) {
                alert("recovery mail has been send")
            }).fail(function(reason) {
                console.log(reason);
            });
        }

    }).fail(function(reason) {
        console.log(reason);
    });
}