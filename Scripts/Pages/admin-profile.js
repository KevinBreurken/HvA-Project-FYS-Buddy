$.getJSON("https://api.ipify.org?format=json", function (data) {
    $("#rightbox").html(data.ip);
})

let current = new Date();
let currentdate = current.getFullYear() + "-" + (current.getMonth() + 1) + "-" + current.getDate();
let currenttime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
let datetime = currentdate + " " + currenttime;

$("#leftbox").html(datetime);
