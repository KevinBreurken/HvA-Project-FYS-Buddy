// $(function () {
//     $.get("Views/on-boarding.html", function (data) {
//         $("div#on-boarding").append($(data))
//     })
// })

let MIN_PROCEDURE = 0
let MAX_PROCEDURE = 1

let onBoarding = $('#on-boarding')
let overlayBackground = $('#overlay-background')
let onBoardingActive = true

let procedure = $('.procedure')
let currentProcedure = 0
procedure[currentProcedure].style.display = 'block'

// TODO remove this when live
onBoarding.show()
overlayBackground.show()

function toggleOnBoarding() {
    if (onBoardingActive === false) {
        onBoarding.show()
        overlayBackground.show()
        onBoardingActive = true
    } else {
        onBoarding.hide()
        overlayBackground.hide()
        onBoardingActive = false
    }
}

function swapStep(i) {
    if (currentProcedure + i >= MIN_PROCEDURE && currentProcedure + i <= MAX_PROCEDURE) {
        procedure[currentProcedure].style.display = 'none'
        procedure[currentProcedure + i].style.display = 'block'
        currentProcedure = currentProcedure + i
    }
}