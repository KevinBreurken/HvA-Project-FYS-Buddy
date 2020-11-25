//----  TRAFIC ----
// ** SITE VISITORS **

// ** LOGGED IN USERS **

// ** TYPE DEVICE **

// ** BROWSER TYPE **


//----  USERS ----
// ** TOTAL ACCOUNTS **
FYSCloud.API.queryDatabase(
    "SELECT * FROM users"
).done(function (data) {
    $('#total-accounts').html(data.length);
    fillMatchesWindow(data.length);
}).fail(function (reason) {
    console.log(reason);
});

// ** AVERAGE VISIT TIME **

//----  PAGES  ----
// ** BOUNCE RATE **
FYSCloud.API.queryDatabase(
    "SELECT * " +
    "FROM pages " +
    "ORDER BY bounce DESC;"
).done(function (data) {
    let listData = [[data.length], [data.length]];
    for (let i = 0; i < data.length; i++) {
        listData[0][i] = data[i].pageName;
        listData[1][i] = data[i].bounce;
    }
    $('#page-bounce').html(makeOL(listData));
}).fail(function (reason) {
    console.log(reason);
    $('#page-bounce').html("ERROR");
});

// ** AMOUNT OF VIEWS **
FYSCloud.API.queryDatabase(
    "SELECT * " +
    "FROM pages " +
    "ORDER BY visits DESC;"
).done(function (data) {
    let listData = [[data.length], [data.length]];
    for (let i = 0; i < data.length; i++) {
        listData[0][i] = data[i].pageName;
        listData[1][i] = data[i].visits;
    }
    $('#page-views').html(makeOL(listData));
}).fail(function (reason) {
    console.log(reason);
    $('#page-views').html("ERROR");
});

function fillMatchesWindow(totalUserCount) {
    //----  MATCHING  ----
    FYSCloud.API.queryDatabase(
        "SELECT * FROM matches"
    ).done(function (data) {
        let totalMatchesCount = data.length;
        let totalContactsShared = 0;
        for (let i = 0; i < data.length; i++)
            totalContactsShared += data[i].contactShared;

        console.log(totalUserCount);

        // ** MADE MATCHES **
        $('#made-matches').html(totalMatchesCount);
        // ** AVERAGE MATCHES PER USER
        $('#made-match-average').html(totalUserCount / totalMatchesCount);
        // ** CONTACT SHARED **
        $('#contacts-shared').html(totalContactsShared);
        // ** AVERAGE CONTACTS SHARED PER USER **
        $('#contacts-shared-average').html((totalUserCount / totalContactsShared).toFixed(2));
    }).fail(function (reason) {
        console.log(reason);
    });

    // ** MOST MATCHES WITH EQUAL INTERESTS **
    FYSCloud.API.queryDatabase(
        "SELECT * " +
        "FROM interests " +
        "ORDER BY matchAmount " +
        "DESC LIMIT 10;"
    ).done(function (data) {
        let listData = [[data.length], [data.length]];
        for (let i = 0; i < data.length; i++) {
            listData[0][i] = data[i].interestName;
            listData[1][i] = data[i].matchAmount;
        }
        $('#most-match-equal-interests').html(makeOL(listData));
    }).fail(function (reason) {
        console.log(reason);
        $('#most-match-equal-interests').html("ERROR");
    });

// ** MOST MATCHES WITH EQUAL DESTINATION **
    FYSCloud.API.queryDatabase(
        "SELECT * " +
        "FROM destinations " +
        "ORDER BY matchAmount " +
        "DESC LIMIT 10;"
    ).done(function (data) {
        let listData = [[data.length], [data.length]];
        for (let i = 0; i < data.length; i++) {
            listData[0][i] = data[i].destinationName;
            listData[1][i] = data[i].matchAmount;
        }
        $('#most-match-equal-destination').html(makeOL(listData));
    }).fail(function (reason) {
        console.log(reason);
        $('#most-match-equal-destination').html("ERROR");
    });
}