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
    // const listItems = document.getElementsByClassName('statistics-item-list-content');
    // var itemList = ["test","words","in","this","list","group"];
    // for (const item of listItems) {
    //     item.innerHTML = makeOL(itemList).innerHTML;
    // }

    //Update pie charts.
    const pieItems = document.getElementsByClassName('statistics-item-piechart');
    for (const item of pieItems) {
        //Create a Chart.js pie chart.
        var context = item.getElementsByClassName('statistics-item-piechart-chart')[0].getContext('2d');
        var myChart = new Chart(context, {
            type: 'pie',
            data: {
                labels: ["One","Two","Three"],
                datasets: [{
                    backgroundColor: pieChartColors,
                    data: [161,237,484]
                }]
            }
        });
    }
}

function makeOL(array) {
    // Create the list element:
    var list = document.createElement('div');
    for (var i = 0; i < array[0].length; i++) {
        // Create the list item:
        var item = document.createElement('li');

        // Set its contents:
        item.appendChild(document.createTextNode(array[0][i]));
        if(array[1] != null)
        item.appendChild(document.createTextNode(" (" +array[1][i] + ")"));
        // Add it to the list:
        list.appendChild(item);
    }

    // Finally, return the constructed list:
    return list;
}