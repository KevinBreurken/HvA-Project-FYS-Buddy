let sessionUserId = getCurrentUserID();
document.getElementById("approve").addEventListener("click", function() {
    FYSCloud.API.queryDatabase(
        "UPDATE `setting`" +
        "SET `deactivated` = '0'" +
        "WHERE `userId` = ?;",
        [sessionUserId]
    ).done(function(data) {
        window.location.href = "homepage.html";
    }).fail(function(reason) {
        console.log(reason);
    });
});

document.getElementById("cancel").addEventListener("click", function() {
   closeSession();
});