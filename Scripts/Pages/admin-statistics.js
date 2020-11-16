/**
 * //TODO: Create dummy metrics for statistics
 * 
 * //TODO: Component - Pages list display
 */
var currentTimeSelection = "day";
/** Dropdown item */
var timeSelection = document.getElementById('time-dropdown');
$('select').on('change', function () {
    currentTimeSelection = this.value;
    renderStatistics();
});

renderStatistics();
function renderStatistics() {

    //Update number items.
    const numberItems = document.getElementsByClassName('statistics-item-number');
    for (const item of numberItems) {
        /**
         * //TODO: Remove randomization.
         * Randomize data for testing purpose.
         */
        item.innerHTML = generateNumberStatisticItemHTML(item.getAttribute('name'), Math.ceil((Math.random() * (10000 - 1) + 1)));
    }

    //Update list items.
    const listItems = document.getElementsByClassName('statistics-item-list');
    for (const item of listItems) {
        item.innerHTML = generateListStatisticItemHTML(item.getAttribute('name'), $(item).data('items'));

        // $(item).find('button').click(function () {
        //     $(item.lastElementChild).toggle();
        // });
    }

    //Update pie charts.
    const pieItems = document.getElementsByClassName('statistics-item-piechart');
    for (const item of pieItems) {
        item.innerHTML = generatePieStatisticItemHTML(item.getAttribute('name'));
        //Create a Chart.js pie chart.

        /**
         * //TODO: Remove randomization.
         * Randomize data for testing purpose.
         */
        const randomData = $(item).data('values');
        for (let i = 0; i < randomData.length; i++) {
            randomData[i] = Math.ceil((Math.random() * (10000 - 1) + 1));
        }

        var context = item.getElementsByClassName('statistics-item-piechart-chart')[0].getContext('2d');
        var myChart = new Chart(context, {
            type: 'pie',
            data: {
                labels: $(item).data('names'),
                datasets: [{
                    backgroundColor: pieChartColors,
                    data: $(item).data('values')
                }]
            }
        });
    }
}
