import { addDraggingEvents } from './scripts/dragging.js';

const fetchData = async () => {
  const rawData = await fetch('https://api.covid19api.com/summary');

  const data = await rawData.json();
  console.log(data);

  const countries = data.Countries;
  addDraggingEvents(countries);
};

fetchData();

//TODO: Remove button
//TODO: more different charts
//TODO: Refresh data in a period of time
//TODO: Add an api with four more charts
//TODO: Styles (don't forget collapse sidenav)
