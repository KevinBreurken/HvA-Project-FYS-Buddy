let pieChartColors = [
    "#2ecc71",
    "#3498db",
    "#95a5a6",
    "#9b59b6",
    "#f1c40f",
    "#e74c3c",
    "#34495e"
];

/*
 * Fetches data from the database related to User category.
 */
(async function fetchUserCategory() {
    // ~~~~ FETCH AMOUNT OF USERS ~~~~
    let userCount;
    await getDataByPromise('SELECT Count(*) AS totalUserCount FROM user').then((data) => {
        userCount = data[0]["totalUserCount"];
        $('#total-accounts').html(userCount);
    });
    // ~~~~ FETCH ALL FRIENDS ~~~~
    getDataByPromise('SELECT * FROM friend').then((data) => {
        let totalFriendsCount = data.length;

        // ** MATCHING - MADE FRIENDS **
        $('#made-friends').html(totalFriendsCount);
        // ** MATCHING - AVERAGE FRIENDS PER USER
        $('#made-friends-average').html((totalFriendsCount / userCount).toFixed(2));
    });
    // ~~~~ FETCH ALL SESSIONS ~~~~
    getDataByPromise('SELECT * FROM adminsessiondata').then((adminSessionData) => {
        let loginTodayAmount = 0;
        let allHours = new Array(adminSessionData.length);
        for (let i = 0; i < adminSessionData.length; i++) {
            let loginDate = new Date(adminSessionData[i]["logintime"]);
            allHours[i] = loginDate.getHours();
            //Increase amount every time an session is from today
            loginTodayAmount += isDateToday(loginDate);
        }
        // ** USERS - MOST VISITED HOUR **
        $('#visit-time-average').html(findCommon(allHours));
        // ** TRAFFIC - LOGGED IN TODAY **
        $('#logged-in').html(loginTodayAmount);
    });
})();

/*
 * Fetches data from the database related to Matching category.
 */
(async function fetchMatchingCategory() {
    let interestData;
    await getDataByPromise(`SELECT *
                            FROM admininterestdata
                            ORDER BY interestEverMatched DESC
                            LIMIT 10;`).then(data => {
        interestData = data;
        let interestIDString = jsonIndexToArrayString(interestData, "interestId");
        return getDataByPromise(`SELECT *
                      FROM interest
                      WHERE id IN ${interestIDString}`);
    }).then(names => {
        let combinedArray = combineJsonToArray(names, interestData, "name", "interestEverMatched");
        //Create list of translation keys for interests.
        let translateKeys = [names.length];
        for (let i = 0; i < names.length; i++) {
            translateKeys[i] = "interests." + names[i].id;
        }

        // ** MATCHING - MOST FRIENDS WITH EQUAL INTEREST **
        $('#most-match-equal-interests').html(generateStatisticsList(combinedArray, translateKeys));
    });

    let locationData;
    await getDataByPromise(`SELECT *
                            FROM adminlocationdata
                            ORDER BY destinationEverMatched DESC
                            LIMIT 10;`).then(data => {
        locationData = data;
        let notificationIDString = jsonIndexToArrayString(locationData, "locationId");
        return getDataByPromise(`SELECT *
                      FROM location
                      WHERE id IN ${notificationIDString}`);
    }).then(names => {
        let combinedArray = combineJsonToArray(names, locationData, "destination", "destinationEverMatched");
        // ** MATCHING - MOST FRIENDS WITH EQUAL DESTINATION **
        $('#most-match-equal-destination').html(generateStatisticsList(combinedArray));
    });
})();

/*
 * Fetches data from the database related to Pages category.
 */
(function fetchPagesCategory() {
    getDataByPromise(`SELECT *
                      FROM adminpagedata
                      ORDER BY logoutamount DESC`).then((data) => {
        // ** LOG-OUT-AMOUNT **
        $('#page-logout').html(generateStatisticsList(jsonToArray(data, ["name", "logoutamount"])));
    });

    getDataByPromise(`SELECT *
                      FROM adminpagedata
                      ORDER BY visitcount DESC`).then((data) => {
        // ** AMOUNT OF VIEWS **
        $('#page-views').html(generateStatisticsList(jsonToArray(data, ["name", "visitcount"])));
    });
})();

/*
 * Fetches data from the database related to Traffic category.
 */
(function fetchTrafficCategory() {
    getDataByPromise('SELECT deviceType, count(*) as amount FROM adminsessiondata GROUP BY deviceType'
    ).then((data) => {
        // ** TYPE DEVICE **
        generatePieChart('#device-type', jsonToArray(data, ["deviceType", "amount"]));
    });

    getDataByPromise('SELECT browserType, count(*) as amount FROM adminsessiondata GROUP BY browserType'
    ).then((data) => {
        // ** BROWSER TYPE **
        generatePieChart('#browser-type', jsonToArray(data, ["browserType", "amount"]));
    });
})();

/**
 * Creates a Multidimensional Array from an JSON object.
 * @param json JSON Object.
 * @param attributes list of attribute names. length of array defines width of returned Array.
 * @returns {[[*], [*]]} Multidimensional Array.
 */
function jsonToArray(json, attributes) {
    let multiArray = [[json.length], [json.length]];
    for (let i = 0; i < json.length; i++) {
        for (let atrI = 0; atrI < attributes.length; atrI++) {
            multiArray[atrI][i] = json[i][attributes[atrI]];
        }
    }
    return multiArray;
}

/**
 * Combines a list of json values to an string used for queries.
 */
function jsonIndexToArrayString(json, attributeName) {
    let notificationIDs = new Array(json.length);
    for (let i = 0; i < notificationIDs.length; i++) {
        notificationIDs[i] = json[i][attributeName];
    }
    return "(" + notificationIDs.toString() + ")";
}

/**
 * Combines two JSON arrays to an single array (fixed size of first element of 2)
 */
function combineJsonToArray(arr1, arr2, atr1, atr2) {
    let newArray = [[2], [arr1.length]];
    for (let i = 0; i < arr1.length; i++) {
        newArray[0][i] = arr1[i][atr1];
        newArray[1][i] = arr2[i][atr2];
    }
    return newArray;
}

/**
 * Checks whether a Date object is the same as the current date.
 * @param date the Date object being checked.
 * @returns {boolean} whether the Date is of today or not.
 */
function isDateToday(date) {
    let today = new Date();
    if (date.getDate() !== today.getDate())
        return false;
    if (date.getMonth() !== today.getMonth())
        return false;
    if (date.getFullYear() !== today.getFullYear())
        return false;

    return true;
}

/**
 * Generates an ChartJS piechart at the given element.
 */
function generatePieChart(elementName, data) {
    //Create a Chart.js pie chart.
    let context = $(elementName);
    new Chart(context, {
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

/**
 * Creates an statistics list for displaying an list of stats.
 */
function generateStatisticsList(dataArray, translateKeys) {
    // Create the list element.
    let list = document.createElement('div');
    for (let i = 0; i < dataArray[0].length; i++) {
        // Create the list item.
        let item = document.createElement('li');
        // Create the text item.
        let textElement = document.createElement('div');
        // Check if we have translation keys.
        (translateKeys !== undefined) ? $(textElement).attr("data-translate", translateKeys[i]) : $(textElement).html(dataArray[0][i]);
        // Add an class for CSS styling.
        $(textElement).addClass("statistics-item-list-text-element");
        item.appendChild(textElement);
        //Create the value item.
        if (dataArray[1] != null) {
            let valueElement = document.createElement('div');
            $(valueElement).addClass("statistics-item-list-value-element");
            valueElement.appendChild(document.createTextNode("   (" + dataArray[1][i] + ")"));
            item.appendChild(valueElement);
        }

        list.appendChild(item);
    }

    // Finally, return the constructed list:
    return list;
}