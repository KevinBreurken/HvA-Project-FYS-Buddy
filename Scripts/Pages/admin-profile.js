$.getJSON("https://api.ipify.org?format=json", function (data) {
    $("#rightbox").html(data.ip);
})

FYSCloud.API.queryDatabase(
    "SELECT `logintime` FROM `adminsessiondata` WHERE id = (SELECT MAX(id) - 1 FROM `adminsessiondata`);"
).done(function (data) {
    let userData = data[0];
    let lastseen = userData.logintime;
    $("#leftbox").html(lastseen);
}).fail(function (reason) {
});