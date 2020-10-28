let validation = true;
// Distance handling:
let distanceUnitResult;
let distanceUnit;
// Store the selected distance unit when an option has been changed and display proper distance unit:
distanceUnitResult = document.getElementById("distanceUnitResult");
document.getElementById("distanceUnit").addEventListener("change", function(e) {
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
distanceRange = document.querySelector("#distance");
// Get element to print result in:
distanceResult = document.querySelector("#distanceResult");

// Print the output of provided distance:
distanceResult.innerHTML = distanceRange.value;

// When changing the range bar's value, print the changed value:
distanceRange.oninput = function() {
    distanceResult.innerHTML = this.value;
}

// Change maximum distance for slider when option has been changed:
document.querySelector("#maxDistance").addEventListener("change", function() {
    if(this.value === "unlimited") {
        // TODO: Hide the elements related to configuring the distance...
    }
    else {
        distanceRange.setAttribute("max", this.value);
        // Update distance result when selected option exceeds slider's previous value.
        if(distanceResult.innerHTML > this.value) {
            distanceResult.innerHTML = this.value;
        }
    }
});

// Block handling:
document.querySelector("input#search-block").addEventListener("input", function() {
    // resultContainer = <div class="search-block-result"></div>
    let resultContainer = document.createElement("div");
    resultContainer.setAttribute("class", "search-block-result");
    let eleToAppendAfter = document.querySelector("button#block-user");
    // If no container element exists, create one:
    // TODO: Think of a way to prevent duplicate code in following sample
    if(this.parentNode.querySelector(".search-block-result") == null) {
        // Display whatever is entered (sample):
        resultContainer.innerText = "Name: " + this.value;
        eleToAppendAfter.parentNode.insertBefore(resultContainer, eleToAppendAfter.nextSibling);

        // TODO: Dynamically load in a list of all possible users that match search criteria and are somehow connected to given logged in user
    }
    else {
        // Element already exists, change its contents:
        this.parentNode.querySelector(".search-block-result").innerText = "Name: " + this.value;

        // TODO: Dynamically load in a list of all possible users that match search criteria and are somehow connected to given logged in user
    }
});

// Validation:
let pwdInput = document.querySelector("#newAccountPassword");
pwdInput.addEventListener("input", function() {
    let validationContainer = document.querySelector("#validationMessage");
    let letterVal = document.querySelector("#letterVal");
    let capitalVal = document.querySelector("#capitalVal");
    let numberVal = document.querySelector("#numberVal");
    let lengthVal = document.querySelector("#lengthVal");
    if(this.value === "") {
        validationContainer.style.display = "none";
    }
    else {
        validationContainer.style.display = "block";
    }

    // Validate lowercase letters
    let lowerCaseLettersReg = /[a-z]/g;
    if(this.value.match(lowerCaseLettersReg)) {
        letterVal.classList.remove("invalid");
        letterVal.classList.add("valid");
    } else {
        letterVal.classList.remove("valid");
        letterVal.classList.add("invalid");
        validation = false;
    }

    // Validate capital letters
    let upperCaseLettersReg = /[A-Z]/g;
    if(this.value.match(upperCaseLettersReg)) {
        capitalVal.classList.remove("invalid");
        capitalVal.classList.add("valid");
    } else {
        capitalVal.classList.remove("valid");
        capitalVal.classList.add("invalid");
        validation = false;
    }

    // Validate numbers
    let numbersReg = /[0-9]/g;
    if(this.value.match(numbersReg)) {
        numberVal.classList.remove("invalid");
        numberVal.classList.add("valid");
    } else {
        numberVal.classList.remove("valid");
        numberVal.classList.add("invalid");
    }

    // Validate length
    const lengthValRequired = 8;
    if(this.value.length >= lengthValRequired) {
        lengthVal.classList.remove("invalid");
        lengthVal.classList.add("valid");
    } else {
        lengthVal.classList.remove("valid");
        lengthVal.classList.add("invalid");
    }

    // If everything has been entered correctly or field was left empty
    if(this.value.match(lowerCaseLettersReg) && this.value.match(upperCaseLettersReg) && this.value.match(numbersReg) && this.value.length >= lengthValRequired || this.value === "") {
        validation = true;
    }
});

// Validate fields on submition:
document.querySelector("#apply").addEventListener("click", function(event) {
    if(validation) {
        // TODO: Store all information related to changes made to settings
    }
    else {
        alert("Some fields are entered incorrectly!");
        event.preventDefault();
    }
});

// On cancellation:
document.querySelector("#cancel").addEventListener("click", function() {
    window.location.href = "index.html";
})