import { addDraggingEvents } from './scripts/dragging.js';

const fetchData = async () => {
  const rawDataAPI1 = await fetch('https://api.covid19api.com/summary');
  const dataAPI1 = await rawDataAPI1.json();
  console.log(dataAPI1);

  const dataPortugal = await fetchDataForCountry('portugal');

  const countries = dataAPI1.Countries;
  addDraggingEvents(countries, dataPortugal);
};

export const fetchDataForCountry = async (country) => {
  const rawDt = await fetch(
    `https://api.covid19api.com/total/dayone/country/${country}`
  );
  const data = await rawDt.json();
  return data;
};

fetchData();

// async function execute() {
//   while (true) {
//     await new Promise((resolve) => setTimeout(resolve, 500));
//     fetchData();
//   }
// }
// execute();

//TODO: 2 different charts
//TODO: Refresh data in a period of time
