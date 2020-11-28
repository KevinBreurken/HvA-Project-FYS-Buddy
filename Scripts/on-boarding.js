$(function () {
    $.get("Views/on-boarding.html", function (data) {
        $("div#on-boarding").append($(data))
    })
})

let overlay = document.getElementById('on-boarding')
overlay.style.display = 'none'

function openOverlay() {
    if (overlay.style.display === 'none') {
        document.getElementById('on-boarding').style.display = 'block'
    } else {
        document.getElementById('on-boarding').style.display = 'none'
    }
}