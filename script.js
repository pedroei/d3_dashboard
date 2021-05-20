import { addDraggingEvents } from './scripts/dragging.js';

const fetchData = async () => {
  const rawData = await fetch('https://api.covid19api.com/summary');

  const data = await rawData.json();
  console.log(data);

  const countries = data.Countries.filter(
    (c) =>
      c.Country === 'Portugal' ||
      c.Country === 'United Kingdom' ||
      c.Country === 'Germany' ||
      c.Country === 'United States of America'
  ); //Only 4 countries so I can test
  addDraggingEvents(countries);
};

fetchData();

//TODO: Add double click on chart to delete
//TODO: API and more charts
//TODO: Local storage
//TODO: Styles
