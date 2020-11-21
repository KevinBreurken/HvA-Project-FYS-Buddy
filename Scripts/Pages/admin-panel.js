function showDetails() {
    let overlay = document.getElementById('overlay')
    let overlayBackground = document.getElementById('overlay-background')
    overlay.style.display = 'block'
    overlayBackground.style.display = 'block'
}

function closeDetails() {
    let overlay = document.getElementById('overlay')
    let overlayBackground = document.getElementById('overlay-background')
    overlay.style.display = 'none'
    overlayBackground.style.display = 'none'
}

function deleteRow(number) {
    let overlay = document.getElementById('row-data-' + number)
    overlay.remove()
}
