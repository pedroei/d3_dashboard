import { testingD3 } from './scripts/d3Functions.js';
import {
  main,
  elTotalCases,
  elDeathsCountry,
  elTotalCountry,
  elRecoveredCountry,
  elNewDeathsCountry,
  elNewCasesCountry,
  elNewRecoveredCountry,
  svgChart,
} from './scripts/elements.js';

const fieldsToUseInChart = {
  NEW_CONFIRMED: 'NewConfirmed',
  NEW_DEATHS: 'NewDeaths',
  NEW_RECOVERED: 'NewRecovered',
  TOTAL_CONFIRMED: 'TotalConfirmed',
  TOTAL_DEATHS: 'TotalDeaths',
  TOTAL_RECOVERED: 'TotalRecovered',
};

const fetchData = async (fieldToUse) => {
  //   const rawData = await fetch('https://api.covid19api.com/summary');
  const rawData = await fetch('https://api.covid19api.com/summary');

  const data = await rawData.json();
  console.log(data);
  //createElements(data.Countries);

  const countries = data.Countries.filter(
    (c) =>
      c.Country === 'Portugal' ||
      c.Country === 'United Kingdom' ||
      c.Country === 'Germany' ||
      c.Country === 'United States of America'
  ); //Only 4 countries so I can test
  //   //   const countries = data.Countries;
  svgChart.innerHTML = '';
  testingD3(countries, fieldToUse);
};

fetchData(fieldsToUseInChart.TOTAL_CONFIRMED);

const createElements = (countries) => {
  countries.forEach((country) => {
    const countryDiv = document.createElement('div');
    const countryName = document.createElement('h2');
    const countryLastDate = document.createElement('h4');
    const countryNewConfirmed = document.createElement('p');
    const countryNewDeaths = document.createElement('p');
    const countryNewRecovered = document.createElement('p');

    const countryTotalConfirmed = document.createElement('p');
    const countryTotalDeaths = document.createElement('p');
    const countryTotalRecovered = document.createElement('p');

    const divider = document.createElement('hr');

    countryName.innerText = country.Country;
    countryDiv.appendChild(countryName);

    countryLastDate.innerText = formatDate(country.Date);
    countryDiv.appendChild(countryLastDate);

    //NEW
    countryNewConfirmed.innerText = `New confirmed: ${country.NewConfirmed}`;
    countryDiv.appendChild(countryNewConfirmed);

    countryNewDeaths.innerText = `New deaths: ${country.NewDeaths}`;
    countryDiv.appendChild(countryNewDeaths);

    countryNewRecovered.innerText = `New recovered: ${country.NewRecovered}`;
    countryDiv.appendChild(countryNewRecovered);

    countryDiv.appendChild(divider);

    //TOTAL
    countryTotalConfirmed.innerText = `Total confirmed: ${country.TotalConfirmed}`;
    countryDiv.appendChild(countryTotalConfirmed);

    countryTotalDeaths.innerText = `Total deaths: ${country.TotalDeaths}`;
    countryDiv.appendChild(countryTotalDeaths);

    countryTotalRecovered.innerText = `Total recovered: ${country.TotalRecovered}`;
    countryDiv.appendChild(countryTotalRecovered);

    main.appendChild(countryDiv);
  });
};

const formatDate = (rawDate) => {
  const date = new Date(rawDate);
  return (
    date.getDate() +
    '/' +
    (date.getMonth() + 1) +
    '/' +
    date.getFullYear() +
    ' ' +
    date.getHours() +
    ':' +
    date.getMinutes() +
    ':' +
    date.getSeconds()
  );
};

const draggables = document.querySelectorAll('.draggable');
const containers = document.querySelectorAll('.custom-container');

draggables.forEach((draggable) => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging');
  });

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging');
  });
});

containers.forEach((container) => {
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
  container.addEventListener('drop', (e) => {
    e.preventDefault();
    const draggable = document.querySelector('.dragging');
    if (draggable.id == 'deaths-country') {
      //Find #chart, create an svg with col class and append it
    }
  });
});

// elTotalCases.addEventListener('click', (e) => {
//   //fieldToUse = fieldsToUseInChart
// });
// elDeathsCountry.addEventListener('click', (e) => {
//   fetchData(fieldsToUseInChart.TOTAL_DEATHS);
// });
// elTotalCountry.addEventListener('click', (e) => {
//   fetchData(fieldsToUseInChart.TOTAL_CONFIRMED);
// });
// elRecoveredCountry.addEventListener('click', (e) => {
//   fetchData(fieldsToUseInChart.TOTAL_RECOVERED);
// });
// elNewDeathsCountry.addEventListener('click', (e) => {
//   fetchData(fieldsToUseInChart.NEW_DEATHS);
// });
// elNewCasesCountry.addEventListener('click', (e) => {
//   fetchData(fieldsToUseInChart.NEW_CONFIRMED);
// });
// elNewRecoveredCountry.addEventListener('click', (e) => {
//   fetchData(fieldsToUseInChart.NEW_RECOVERED);
// });
