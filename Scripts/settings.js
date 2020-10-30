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
    const resultContainer = this.parentNode.querySelector("#searchBlockResult");
    let result = "";
    // Check if given input is empty:
    if(this.value === "") {
        // remove any existing result container if available:
        resultContainer.remove();
    }
    else {
        // Get a collection of users:
        // TODO: Get a list of users from the backend that are connected to the person editing the settings.
        // temp:
        const users = ["Barry Stavenuiter", "Dylan van den Berg", "Hanna Toenbreker", "Kiet van Wijk", "Kevin Breurken", "Irene Doodeman", "Chris Verra"];
        // Loop through collection of users and compare it to provided input for matching results:
        let providedInput = this.value.toUpperCase();
        for(let i = 0; i < users.length; i++) {
            if(users[i].toUpperCase().indexOf(providedInput) > -1) {
                result += "<div class=\"user-card\">" +
                    "<div class=\"user-card-image\"></div>" +
                    "<div class=\"user-card-content\">" +
                    "<div class=\"card-info\">" + users[i] + "<br />Eventual information...</div>" +
                    "<div class=\"card-control\">" +
                    "<button>Block</button>" +
                    "</div>" +
                    "</div>" +
                    "</div>";
            }
        }
        // If no container element exists, create one:
        if(resultContainer === null) {
            // resultContainer = <div class="search-block-result"></div>
            const resultContainer = document.createElement("div");
            resultContainer.setAttribute("id", "searchBlockResult");
            const eleToAppendAfter = document.querySelector("button#block-user");
            // Display whatever is entered (sample):
            resultContainer.innerHTML = result;
            eleToAppendAfter.parentNode.insertBefore(resultContainer, eleToAppendAfter.nextSibling);
        }
        else {
            // Element already exists, change its contents:
            resultContainer.innerHTML =  result;
        }
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

// Check whether own gender should only be shown:
// document.querySelector("#showOwnGenderOnly").addEventListener("change", function() {
//     if(this.checked) {
//         if(confirm("What do you indentify as?")) {
//             document.querySelector("#identifyAsContainer").style.display = "block";
//         }
//     }
//     else {
//         document.querySelector("#identifyAsContainer").style.display = "none";
//     }
// });

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

/* Some sample code to pull a HTML file
var request = new XMLHttpRequest();

request.open('GET', '/somepage', true);

request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
        var resp = request.responseText;

        document.querySelector('#div').innerHTML = resp;
    }
};

request.send();*/
