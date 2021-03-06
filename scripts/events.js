import {
  createChart,
  createDonutChart,
  createLineChart,
  createMapChart,
  createBubbleChart,
  createCircularBarPlotChart,
} from './charts.js';

const fieldsToUseInChart = {
  NEW_CONFIRMED: 'NewConfirmed',
  NEW_DEATHS: 'NewDeaths',
  NEW_RECOVERED: 'NewRecovered',
  TOTAL_CONFIRMED: 'TotalConfirmed',
  TOTAL_DEATHS: 'TotalDeaths',
  TOTAL_RECOVERED: 'TotalRecovered',
};

const draggables = document.querySelectorAll('.draggable');
const container = document.querySelector('.main');

let data;
let dataCountry;
let sizesXY = [1000, 600];

const mapSizes = { width: 920, height: 450 };

export const updateData = (newCountries, newDataPortugal) => {
  data = newCountries;
  dataCountry = newDataPortugal;
};

export const addDraggingEvents = (allCountries, dataPortugal) => {
  data = allCountries;
  dataCountry = dataPortugal;
  draggables.forEach((draggable) => {
    draggable.addEventListener('dragstart', () => {
      draggable.classList.add('dragging');
    });

    draggable.addEventListener('dragend', () => {
      draggable.classList.remove('dragging');
    });
  });

  container.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  container.addEventListener('drop', (e) => {
    e.preventDefault();
    const draggable = document.querySelector('.dragging');

    const items = document.querySelectorAll('.item');

    if (items.length > 0) {
      // if (items.length > 1) {
      items.forEach((item) => {
        const svg = item.children[0].children[0];
        if (
          svg.classList.contains('map') ||
          svg.classList.contains('circular')
        ) {
          item.style.width = mapSizes.width + 'px';
          item.style.height = mapSizes.height + 'px';
        } else {
          item.style.width = '440px';
          item.style.height = '300px';
        }

        decideChartAndCreate(item, data, null, 440, 300, svg, null);
      });
      grid.refreshItems();
      sizesXY = [440, 300];
    }
    if (items.length > 3) {
      items.forEach((item) => {
        const svg = item.children[0].children[0];
        if (
          svg.classList.contains('map') ||
          svg.classList.contains('circular')
        ) {
          item.style.width = mapSizes.width + 'px';
          item.style.height = mapSizes.height + 'px';
        } else {
          item.style.width = '280px';
          item.style.height = '200px';
        }

        decideChartAndCreate(item, data, null, 280, 200, svg, null);
      });
      grid.refreshItems();
      sizesXY = [280, 200];
    }

    if (draggable.id == 'deaths-country') {
      createDonutChart(
        data,
        fieldsToUseInChart.TOTAL_DEATHS,
        sizesXY[0],
        sizesXY[1]
      );
    }
    if (draggable.id == 'cases-country') {
      createChart(
        data,
        fieldsToUseInChart.TOTAL_CONFIRMED,
        sizesXY[0],
        sizesXY[1]
      );
    }
    if (draggable.id == 'recovered-country') {
      createChart(
        data,
        fieldsToUseInChart.TOTAL_RECOVERED,
        sizesXY[0],
        sizesXY[1]
      );
    }
    if (draggable.id == 'new-deaths-country') {
      createChart(data, fieldsToUseInChart.NEW_DEATHS, sizesXY[0], sizesXY[1]);
    }
    if (draggable.id == 'new-cases-country') {
      createChart(
        data,
        fieldsToUseInChart.NEW_CONFIRMED,
        sizesXY[0],
        sizesXY[1]
      );
    }
    if (draggable.id == 'new-recovered-country') {
      createChart(
        data,
        fieldsToUseInChart.NEW_RECOVERED,
        sizesXY[0],
        sizesXY[1]
      );
    }
    if (draggable.id == 'cases-this-week') {
      createLineChart(
        dataCountry,
        fieldsToUseInChart.TOTAL_CONFIRMED,
        sizesXY[0],
        sizesXY[1]
      );
    }
    if (draggable.id == 'all-cases-all-countries') {
      createMapChart(
        data,
        fieldsToUseInChart.TOTAL_CONFIRMED,
        mapSizes.width,
        mapSizes.height
      );
    }
    if (draggable.id == 'new-cases-all-countries') {
      createBubbleChart(
        data,
        fieldsToUseInChart.NEW_DEATHS,
        sizesXY[0],
        sizesXY[1]
      );
    }
    if (draggable.id == 'top-50-countries.recovers') {
      createCircularBarPlotChart(
        data,
        fieldsToUseInChart.TOTAL_RECOVERED,
        mapSizes.width,
        mapSizes.height
      );
    }
  });

  getStoredCharts();
};

window.addEventListener(
  'resize',
  function (event) {
    var w = window.innerWidth;
    var h = window.innerHeight;

    if (w > 950) {
      const items = document.querySelectorAll('.item');
      if (items.length <= 1) {
        items.forEach((item) => {
          if (
            svg.classList.contains('map') ||
            svg.classList.contains('circular')
          ) {
            item.style.width = mapSizes.width + 'px';
            item.style.height = mapSizes.height + 'px';
          } else {
            item.style.width = '1000px';
            item.style.height = '600px';
          }

          const svg = item.children[0].children[0];

          decideChartAndCreate(item, data, null, 1000, 600, svg, null);
        });
        grid.refreshItems();
        sizesXY = [1000, 600];
      }
    }

    if (w <= 950) {
      const items = document.querySelectorAll('.item');
      items.forEach((item) => {
        const svg = item.children[0].children[0];
        if (
          svg.classList.contains('map') ||
          svg.classList.contains('circular')
        ) {
          item.style.width = mapSizes.width + 'px';
          item.style.height = mapSizes.height + 'px';
        } else {
          item.style.width = '440px';
          item.style.height = '300px';
        }

        decideChartAndCreate(item, data, null, 440, 300, svg, null);
      });
      grid.refreshItems();
      sizesXY = [440, 300];
    }

    if (w <= 650) {
      const items = document.querySelectorAll('.item');
      items.forEach((item) => {
        const svg = item.children[0].children[0];
        if (
          svg.classList.contains('map') ||
          svg.classList.contains('circular')
        ) {
          item.style.width = mapSizes.width + 'px';
          item.style.height = mapSizes.height + 'px';
        } else {
          item.style.width = '280px';
          item.style.height = '200px';
        }

        decideChartAndCreate(item, data, null, 280, 200, svg, null);
      });
      grid.refreshItems();
      sizesXY = [280, 200];
    }
  },
  true
);

window.addEventListener('beforeunload', () => {
  // stores ordered charts when closing
  const orderedArray = [];

  if (grid.getItems()) {
    grid.getItems().forEach((item) => {
      orderedArray.push({
        field: item._element.children[0].children[0].classList[0],
        type: item._element.children[0].children[0].classList[1],
      });
    });
  }
  window.localStorage.setItem('charts', JSON.stringify(orderedArray));
});

export const getStoredCharts = () => {
  if (localStorage.getItem('charts')) {
    const storedCharts = JSON.parse(localStorage.getItem('charts'));
    const sizes = { x: 1000, y: 600 };

    if (storedCharts.length >= 2 && storedCharts.length <= 4) {
      sizes.x = 440;
      sizes.y = 300;
    }

    if (storedCharts.length > 4) {
      sizes.x = 280;
      sizes.y = 200;
    }

    storedCharts.forEach((chart) => {
      if (chart.type === 'bar') {
        createChart(data, chart.field, sizes.x, sizes.y, null, true);
      }
      if (chart.type === 'donut') {
        createDonutChart(data, chart.field, sizes.x, sizes.y, null, true);
      }
      if (chart.type === 'line') {
        createLineChart(dataCountry, chart.field, sizes.x, sizes.y, null, true);
      }
      if (chart.type === 'map') {
        createMapChart(
          data,
          chart.field,
          mapSizes.width,
          mapSizes.height,
          null,
          true
        );
      }
      if (chart.type === 'bubble') {
        createBubbleChart(data, chart.field, sizes.x, sizes.y, null, true);
      }
      if (chart.type === 'circular') {
        createCircularBarPlotChart(
          data,
          chart.field,
          mapSizes.width,
          mapSizes.height,
          null,
          true
        );
      }
    });
  }
};

const decideChartAndCreate = (item, data, field, width, height, svg, local) => {
  if (item.children[0].children[0].classList.contains('bar')) {
    createChart(data, field, width, height, svg);
  } else if (item.children[0].children[0].classList.contains('donut')) {
    createDonutChart(data, field, width, height, svg);
  } else if (item.children[0].children[0].classList.contains('line')) {
    createLineChart(dataCountry, field, width, height, svg);
  } else if (item.children[0].children[0].classList.contains('map')) {
    createMapChart(data, field, mapSizes.width, mapSizes.height, svg);
  } else if (item.children[0].children[0].classList.contains('bubble')) {
    createBubbleChart(data, field, width, height, svg);
  } else if (item.children[0].children[0].classList.contains('circular')) {
    createCircularBarPlotChart(
      data,
      field,
      mapSizes.width,
      mapSizes.height,
      svg
    );
  }
};
