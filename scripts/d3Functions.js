//D3
export const createChart = (countries, fieldReceived, width, height, svg) => {
  let fieldToUse;
  if (fieldReceived) fieldToUse = fieldReceived;

  let content;
  if (svg) {
    fieldToUse = svg.classList[0];
    content = svg.parentNode;
    svg.remove();
  }
  const MARGINS = { top: 20, bottom: 10 };
  const CHART_WIDTH = width;
  const CHART_HEIGHT = height - MARGINS.top - MARGINS.bottom;

  const AUGMENTED_SCALE = 10000000;

  let svgID;
  if (!svg) {
    svgID = createSVG(
      CHART_WIDTH,
      CHART_HEIGHT + MARGINS.top + MARGINS.bottom,
      fieldToUse
    );
  } else {
    svgID = createSVGWidthContent(content, fieldToUse);
  }

  const x = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
  const y = d3.scaleLinear().range([CHART_HEIGHT, 0]);

  const chartContainer = d3
    .select(`#${svgID}`)
    .attr('width', CHART_WIDTH)
    .attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom);

  x.domain(countries.map((c) => c.CountryCode));
  y.domain([
    0,
    d3.max(countries, (c) => chooseField(c, fieldToUse)) + AUGMENTED_SCALE,
  ]); //Space to see above

  const chart = chartContainer.append('g');

  chart
    .append('g')
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .attr('transform', `translate(0, ${CHART_HEIGHT})`)
    .attr('color', '#000');

  chart
    .selectAll('.bar')
    .data(countries)
    .enter()
    .append('rect')
    .classed('bar', true)
    .attr('width', x.bandwidth())
    .attr('height', (data) => CHART_HEIGHT - y(chooseField(data, fieldToUse)))
    .attr('x', (data) => x(data.CountryCode))
    .attr('y', (data) => y(chooseField(data, fieldToUse)));

  chart
    .selectAll('.label')
    .data(countries)
    .enter()
    .append('text')
    .text((data) => chooseField(data, fieldToUse))
    .attr('x', (data) => x(data.CountryCode) + x.bandwidth() / 2)
    .attr('y', (data) => y(chooseField(data, fieldToUse)) - 20)
    .attr('text-anchor', 'middle')
    .classed('label', true);
};

const createSVG = (WIDTH, HEIGHT, fieldReceived) => {
  //svg is in a different namespace
  const svgDiv = document.createElement('div');
  const svgDivContent = document.createElement('div');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const svgID = generateID();

  svgDiv.style.width = `${WIDTH}px`;
  svgDiv.style.height = `${HEIGHT}px`;

  svgDiv.classList.add('item');
  svgDivContent.classList.add('item-content');
  svg.setAttribute('id', svgID);
  svg.classList.add(fieldReceived);

  svgDivContent.append(svg);
  svgDiv.append(svgDivContent);
  grid.add(svgDiv);

  //addRemoveEvent(svgDiv);
  return svgID;
};

const generateID = () => {
  return 'axxxxxxxxxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const chooseField = (country, fieldReceived) => {
  if (fieldReceived === 'NewConfirmed') return country.NewConfirmed;
  if (fieldReceived === 'NewDeaths') return country.NewDeaths;
  if (fieldReceived === 'NewRecovered') return country.NewRecovered;
  if (fieldReceived === 'TotalConfirmed') return country.TotalConfirmed;
  if (fieldReceived === 'TotalDeaths') return country.TotalDeaths;
  if (fieldReceived === 'TotalRecovered') return country.TotalRecovered;
};

const addRemoveEvent = (item) => {
  const itemContent = item.children[0];
  const svg = item.children[0];

  item.addEventListener('dblclick', (e) => {
    grid.remove([e.target.parentNode.parentNode], {
      removeElements: true,
    });
    svg.remove();
    itemContent.remove();
    grid.refreshItems();
    const ite = grid.getItem(0);
    console.log(ite._element);
    grid.remove(ite._element);
    console.log(document.querySelectorAll('.item'));
  });
};

const createSVGWidthContent = (content, fieldReceived) => {
  const svgDivContent = content;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const svgID = generateID();

  svg.setAttribute('id', svgID);
  svg.classList.add(fieldReceived);

  svgDivContent.append(svg);
  return svgID;
};
