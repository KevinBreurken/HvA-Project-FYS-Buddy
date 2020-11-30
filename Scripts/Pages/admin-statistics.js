var pieChartColors = [
    "#2ecc71",
    "#3498db",
    "#95a5a6",
    "#9b59b6",
    "#f1c40f",
    "#e74c3c",
    "#34495e"
];

var currentTimeSelection = "day";
/** Dropdown item */
var timeSelection = document.getElementById('time-dropdown');
$('select').on('change', function () {
    currentTimeSelection = this.value;
    renderStatistics();
});

renderStatistics();

function renderStatistics() {

    //Update list items.
    const listItems = document.getElementsByClassName('statistics-item-list-content');
    var itemList = ["test", "words", "in", "this", "list", "group"];
    for (const item of listItems) {
        item.innerHTML = makeOL(itemList).innerHTML;
    }

    //Update pie charts.
    const pieItems = document.getElementsByClassName('statistics-item-piechart');
    for (const item of pieItems) {
        //Create a Chart.js pie chart.
        var context = item.getElementsByClassName('statistics-item-piechart-chart')[0].getContext('2d');
        var myChart = new Chart(context, {
            type: 'pie',
            data: {
                labels: ["One", "Two", "Three"],
                datasets: [{
                    backgroundColor: pieChartColors,
                    data: [161, 237, 484]
                }]
            }
        });
    }
}

function makeOL(array) {
    // Create the list element:
    var list = document.createElement('ol');
    for (var i = 0; i < array.length; i++) {
        // Create the list item:
        var item = document.createElement('li');

        // Set its contents:
        item.appendChild(document.createTextNode(array[i]));

        // Add it to the list:
        list.appendChild(item);
    }

    // Finally, return the constructed list:
    return list;
}

var statisticsTranslation = {
    trafic: {
        title: {
            nl: "Verkeer",
            en: "Trafic"
        },
        visitors: {
            nl: "Bezoekers Vandaag",
            en: "Visitors Today"
        },
        login: {
            nl: "Vandaag Ingelogd",
            en: "Logged in Today"
        },
        device: {
            nl: "Toestel Type",
            en: "Type Device"
        },
        browser: {
            nl: "Browser Type",
            en: "Browser Type"
        },
    },
    users: {
        title: {
            nl: "Gebruikers",
            en: "Users"
        },
        accounts: {
            nl: "Aantal Accounts",
            en: "Total Accounts"
        },
        visit: {
            nl: "Gemiddelde Bezoekstijd",
            en: "Average Visit Time"
        },
    },
    matching: {
        title: {
            nl: "Matchen",
            en: "Matching"
        },
        matches: {
            nl: "Totaal Aantal Matches",
            en: "Made Matches"
        },
        contacts: {
            nl: "Contacten Verstuurd",
            en: "Contacts Shared"
        },
        matchesAvg: {
            nl: "Gemiddelde Aantal Matches Per Gebruiker",
            en: "Average Matches Per User"
        },
        contactsAvg: {
            nl: "Gemiddelde Contacten Verstuurd Per Gebruiker",
            en: "Average Contacts Shared Per User"
        },
        equalInterest: {
            nl: "Meest Gematchde Interesses:",
            en: "Most Matched With Equal Interest:"
        },
        equalDestination: {
            nl: "Meest Gematchde Locaties:",
            en: "Most Matched With Equal Destination:"
        }
    },
    pages: {
        title: {
            nl: "Pagina's",
            en: "Pages"
        },
        bounce: {
            nl: "Bounce Rate:",
            en: "Bounce Rate:"
        },
        views: {
            nl: "Aantal Keer Bekeken:",
            en: "Amount of Views:"
        }
    }
};
FYSCloud.Localization.Buddy.addTranslationJSON(statisticsTranslation);