import { testingD3 } from './d3Functions.js';

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

export const addDraggingEvents = (allCountries) => {
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
    if (draggable.id == 'deaths-country') {
      testingD3(allCountries, fieldsToUseInChart.TOTAL_DEATHS, 450, 300);
    }
    if (draggable.id == 'cases-country') {
      testingD3(allCountries, fieldsToUseInChart.TOTAL_CONFIRMED, 450, 300);
    }
    if (draggable.id == 'recovered-country') {
      testingD3(allCountries, fieldsToUseInChart.TOTAL_RECOVERED, 450, 300);
    }
    if (draggable.id == 'new-deaths-country') {
      testingD3(allCountries, fieldsToUseInChart.NEW_DEATHS, 450, 300);
    }
    if (draggable.id == 'new-cases-country') {
      testingD3(allCountries, fieldsToUseInChart.NEW_CONFIRMED, 450, 300);
    }
    if (draggable.id == 'new-recovered-country') {
      testingD3(allCountries, fieldsToUseInChart.NEW_RECOVERED, 450, 300);
    }
  });
};
