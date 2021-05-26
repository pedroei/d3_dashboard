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

//TODO: more different charts
//TODO: Refresh data for in a period of time
//TODO: Add an api with four more charts
//TODO: More countries in bar chart, and adapt next charts to have more countries (if it makes sense)
//TODO: Styles (don't forget collapse sidenav)
