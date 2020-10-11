let distanceUnitResult;
let distanceUnit;
// Store the selected distance unit when an option has been changed and display proper distance unit:
distanceUnitResult = document.getElementById("distanceUnitResult");
document.getElementById("distanceUnit").addEventListener('change', function(e) {
    if(e.target.name === "distanceUnit") {
        // Store selected distance unit:
        distanceUnit = e.target.value;
        console.log("Distance unit has been changed to: ", distanceUnit);

        // Apply distance unit:
        distanceUnitResult.innerHTML = distanceUnit;
    }
});

let distanceRange;
let distanceResult;
// Get provided distance:
distanceRange = document.getElementById("distance");
// Get element to print result in:
distanceResult = document.getElementById("distanceResult");

// Print the output of provided distance:
distanceResult.innerHTML = distanceRange.value;

// When changing the range bar's value, print the changed value:
distanceRange.oninput = function() {
    distanceResult.innerHTML = this.value;
}

