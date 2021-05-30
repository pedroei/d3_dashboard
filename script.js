import { addDraggingEvents, updateData } from './scripts/events.js';

const elTotalCases = document.querySelector('#total-global');

let firstTime = true;

const fetchData = async () => {
  const rawDataAPI1 = await fetch('https://api.covid19api.com/summary');
  const dataAPI1 = await rawDataAPI1.json();
  console.log(dataAPI1);

  const dataPortugal = await fetchDataForCountry('portugal');

  elTotalCases.innerHTML =
    'Total confirmed global: ' + dataAPI1.Global.TotalConfirmed;

  const countries = dataAPI1.Countries;

  if (firstTime) {
    addDraggingEvents(countries, dataPortugal);
  } else {
    updateData(countries, dataPortugal);
  }
  firstTime = false;

  setTimeout(() => fetchData(), 10000);
};

export const fetchDataForCountry = async (country) => {
  const rawDt = await fetch(
    `https://api.covid19api.com/total/dayone/country/${country}`
  );
  const data = await rawDt.json();
  return data;
};

fetchData();
