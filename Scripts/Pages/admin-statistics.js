var pieChartColors = [
    "#2ecc71",
    "#3498db",
    "#95a5a6",
    "#9b59b6",
    "#f1c40f",
    "#e74c3c",
    "#34495e"
];

function generatePiechart(divID, data) {
    //Create a Chart.js pie chart.
    var context = $(divID);
    var myChart = new Chart(context, {
        type: 'pie',
        data: {
            labels: data[0],
            datasets: [{
                backgroundColor: pieChartColors,
                data: data[1]
            }]
        }
    });
    
}

function makeOL(array) {
    // Create the list element:
    var list = document.createElement('div');
    for (var i = 0; i < array[0].length; i++) {
        // Create the list item:
        var item = document.createElement('li');

        // Set its contents:
        item.appendChild(document.createTextNode(array[0][i]));
        if (array[1] != null)
            item.appendChild(document.createTextNode(" (" + array[1][i] + ")"));
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
            nl: "Accounts uitgelogd op:",
            en: "Logged out on:"
        },
        views: {
            nl: "Aantal Keer Bekeken:",
            en: "Amount of Views:"
        }
    }
};

FYSCloud.Localization.CustomTranslations.addTranslationJSON(statisticsTranslation);