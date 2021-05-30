export const createSVG = (WIDTH, HEIGHT, fieldReceived, type) => {
  //svg is in a different namespace
  const svgDiv = document.createElement('div');
  const svgDivContent = document.createElement('div');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const svgID = generateID();

  const deleteBtn = document.createElement('i');
  deleteBtn.classList.add('fas');
  deleteBtn.classList.add('fa-times');
  deleteBtn.classList.add('fa-sm');

  svgDiv.style.width = `${WIDTH}px`;
  svgDiv.style.height = `${HEIGHT}px`;

  svgDiv.classList.add('item');
  svgDivContent.classList.add('item-content');
  svg.setAttribute('id', svgID);
  svg.classList.add(fieldReceived);
  svg.classList.add(type);

  svgDivContent.append(svg);
  svgDiv.append(svgDivContent);
  svgDiv.append(deleteBtn);
  grid.add(svgDiv);

  addRemoveEvent(svgDiv, fieldReceived, type, deleteBtn);
  return svgID;
};

const generateID = () => {
  return 'axxxxxxxxxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const chooseField = (country, fieldReceived) => {
  if (fieldReceived === 'NewConfirmed') return country.NewConfirmed;
  if (fieldReceived === 'NewDeaths') return country.NewDeaths;
  if (fieldReceived === 'NewRecovered') return country.NewRecovered;
  if (fieldReceived === 'TotalConfirmed') return country.TotalConfirmed;
  if (fieldReceived === 'TotalDeaths') return country.TotalDeaths;
  if (fieldReceived === 'TotalRecovered') return country.TotalRecovered;
};

const addRemoveEvent = (itemEl, field, type, btn) => {
  btn.addEventListener('click', (e) => {
    const item = grid.getItems(itemEl)[0];

    grid.remove(grid.getItems(itemEl), { removeElements: true });
    grid.refreshItems();
    grid.layout();

    removeFromLocalStorage({ field: field, type: type });
  });
};

export const createSVGWidthContent = (content, fieldReceived, type) => {
  const svgDivContent = content;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const svgID = generateID();

  svg.setAttribute('id', svgID);
  svg.classList.add(fieldReceived);
  svg.classList.add(type);

  svgDivContent.append(svg);
  return svgID;
};

export const saveToLocalStorage = (chartObject) => {
  let storedCharts;

  if (localStorage.getItem('charts')) {
    storedCharts = JSON.parse(localStorage.getItem('charts'));
  } else {
    storedCharts = [];
  }
  storedCharts.push(chartObject);
  window.localStorage.setItem('charts', JSON.stringify(storedCharts));
};

const removeFromLocalStorage = (itemToRemove) => {
  let storedCharts = JSON.parse(localStorage.getItem('charts'));

  const foundItem = storedCharts.find((c) => c.field === itemToRemove.field);
  const itemIndex = storedCharts.indexOf(foundItem);
  storedCharts.splice(itemIndex, 1);

  window.localStorage.setItem('charts', JSON.stringify(storedCharts));
  // resizeAll();
};

export const getFilteredCountries = (raw, type) => {
  if (type === 'bar') {
    return raw.filter(
      (c) =>
        c.Country === 'Portugal' ||
        c.Country === 'United Kingdom' ||
        c.Country === 'Germany' ||
        c.Country === 'United States of America' ||
        c.Country === 'Spain' ||
        c.Country === 'India' ||
        c.Country === 'Brazil'
    );
  } else if (type === 'donut') {
    return raw.filter(
      (c) =>
        c.Country === 'Portugal' ||
        c.Country === 'United Kingdom' ||
        c.Country === 'Germany' ||
        c.Country === 'United States of America' ||
        c.Country === 'Spain'
    );
  }
};
