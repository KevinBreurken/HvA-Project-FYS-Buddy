let MIN_PROCEDURE = 0
let MAX_PROCEDURE = 2

let onBoarding = $('#on-boarding')
let overlayBackground = $('#overlay-background')
let onBoardingActive = false
let btn = $(".btn-OB")

let procedure = $('.procedure')
let currentProcedure = 0

function toggleOnBoarding() {
    // Makes it so that everyone you open open the on boarding window it starts at the first procedure
    currentProcedure = 0
    btn[0].style.display = 'none'
    btn[1].style.display = 'block'
    btn[2].style.display = 'block'

    procedure[0].style.display = 'block'
    procedure[1].style.display = 'none'
    procedure[2].style.display = 'none'

    // Shows and hides the on boarding window
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
    // Goes either the the next step or back depending on what button the user presses
    if (currentProcedure + i >= MIN_PROCEDURE && currentProcedure + i <= MAX_PROCEDURE) {
        procedure[currentProcedure].style.display = 'none'
        procedure[currentProcedure + i].style.display = 'block'
        currentProcedure = currentProcedure + i
    }
    // Makes sure the correct buttons are displayed on each procedure
    if (currentProcedure === 0) {
        btn[0].style.display = 'none'
        btn[1].style.display = 'block'
        btn[2].style.display = 'none'
    }
    if (currentProcedure === 1) {
        btn[0].style.display = 'none'
        btn[1].style.display = 'block'
        btn[2].style.display = 'block'
    }
    if (currentProcedure === 2) {
        btn[0].style.display = 'block'
        btn[1].style.display = 'none'
        btn[2].style.display = 'block'
    }
}