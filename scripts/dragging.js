import { createChart } from './d3Functions.js';

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
let sizesXY = [1000, 600];

export const addDraggingEvents = (allCountries) => {
  data = allCountries;
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
      items.forEach((item) => {
        item.style.width = '510px';
        item.style.height = '400px';

        const svg = item.children[0].children[0];

        createChart(allCountries, null, 510, 400, svg);
      });
      grid.refreshItems();
      sizesXY = [510, 400];
    }

    if (items.length > 1) {
      items.forEach((item) => {
        item.style.width = '450px';
        item.style.height = '300px';

        const svg = item.children[0].children[0];

        createChart(allCountries, null, 450, 300, svg);
      });
      grid.refreshItems();
      sizesXY = [450, 300];
    }
    if (items.length > 3) {
      items.forEach((item) => {
        item.style.width = '300px';
        item.style.height = '200px';

        const svg = item.children[0].children[0];

        createChart(allCountries, null, 300, 200, svg);
      });
      grid.refreshItems();
      sizesXY = [300, 200];
    }

    if (draggable.id == 'deaths-country') {
      createChart(
        allCountries,
        fieldsToUseInChart.TOTAL_DEATHS,
        sizesXY[0],
        sizesXY[1]
      );
    }
    if (draggable.id == 'cases-country') {
      createChart(
        allCountries,
        fieldsToUseInChart.TOTAL_CONFIRMED,
        sizesXY[0],
        sizesXY[1]
      );
    }
    if (draggable.id == 'recovered-country') {
      createChart(
        allCountries,
        fieldsToUseInChart.TOTAL_RECOVERED,
        sizesXY[0],
        sizesXY[1]
      );
    }
    if (draggable.id == 'new-deaths-country') {
      createChart(
        allCountries,
        fieldsToUseInChart.NEW_DEATHS,
        sizesXY[0],
        sizesXY[1]
      );
    }
    if (draggable.id == 'new-cases-country') {
      createChart(
        allCountries,
        fieldsToUseInChart.NEW_CONFIRMED,
        sizesXY[0],
        sizesXY[1]
      );
    }
    if (draggable.id == 'new-recovered-country') {
      createChart(
        allCountries,
        fieldsToUseInChart.NEW_RECOVERED,
        sizesXY[0],
        sizesXY[1]
      );
    }
  });
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
          item.style.width = '1000px';
          item.style.height = '600px';

          const svg = item.children[0].children[0];

          createChart(data, null, 1000, 600, svg);
        });
        grid.refreshItems();
        sizesXY = [1000, 600];
      }
      if (items.length <= 2) {
        items.forEach((item) => {
          item.style.width = '510px';
          item.style.height = '400px';

          const svg = item.children[0].children[0];

          createChart(data, null, 510, 400, svg);
        });
        grid.refreshItems();
        sizesXY = [510, 400];
      }
    }

    if (w <= 950) {
      const items = document.querySelectorAll('.item');
      items.forEach((item) => {
        item.style.width = '450px';
        item.style.height = '300px';

        const svg = item.children[0].children[0];

        createChart(data, null, 450, 300, svg);
      });
      grid.refreshItems();
      sizesXY = [450, 300];
    }

    if (w <= 650) {
      const items = document.querySelectorAll('.item');
      items.forEach((item) => {
        item.style.width = '300px';
        item.style.height = '200px';

        const svg = item.children[0].children[0];

        createChart(data, null, 300, 200, svg);
      });
      grid.refreshItems();
      sizesXY = [300, 200];
    }
  },
  true
);
