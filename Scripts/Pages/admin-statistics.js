var pieChartColors = [
    "#2ecc71",
    "#3498db",
    "#95a5a6",
    "#9b59b6",
    "#f1c40f",
    "#e74c3c",
    "#34495e"
];

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