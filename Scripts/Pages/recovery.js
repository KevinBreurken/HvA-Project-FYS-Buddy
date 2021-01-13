function redirectBack() {
    location.href='index.html';
}

function emailValidation() {
    let emailInput = document.getElementById("recovery-email").value;
    FYSCloud.API.queryDatabase(
        "SELECT * FROM user WHERE email = ?",
        [emailInput]
    ).done(async function(data) {
        if(data.length > 0){
            for (let i = 0; i < data.length; i++) {
                const mailURL = `${window.location.origin}/changepass.html?id=${data[i].id}`;
                const languageKey = await determineMailLanguage(data[i].id);
                const mailHTML = await generateMailHTML(data[i].username,'recovery',mailURL,languageKey);
                const subject = CustomTranslation.getStringFromTranslations(`mail.recovery.subject`, languageKey);

                await sendEmailByPromise(data[i].email,data[i].username,subject,mailHTML).then((data) =>{
                    alert("recovery mail has been send");
                });
            }
            }else{
                alert("No email found.\nPlease make sure you are using the right e-mail address");
                $('#recovery-email').focus();
            }
    });
}