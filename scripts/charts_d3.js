import { getStoredCharts, resizeAll } from './dragging.js';
//D3
export const createChart = (
  rawCountries,
  fieldReceived,
  width,
  height,
  svg,
  local
) => {
  const countries = getFilteredCountries(rawCountries, 'bar');

  let fieldToUse;
  if (fieldReceived) fieldToUse = fieldReceived;

  let content;
  if (svg) {
    fieldToUse = svg.classList[0];
    content = svg.parentNode;
    svg.remove();
  }

  if (!svg && !local) saveToLocalStorage({ field: fieldToUse, type: 'bar' });

  const MARGINS = { top: 20, bottom: 10 };
  const CHART_WIDTH = width;
  const CHART_HEIGHT = height - MARGINS.top - MARGINS.bottom;

  const AUGMENTED_SCALE = 10000000;

  let svgID;
  if (!svg) {
    svgID = createSVG(
      CHART_WIDTH,
      CHART_HEIGHT + MARGINS.top + MARGINS.bottom,
      fieldToUse,
      'bar'
    );
  } else {
    svgID = createSVGWidthContent(content, fieldToUse, 'bar');
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
    .style('font-size', '11px')
    .attr('x', (data) => x(data.CountryCode) + x.bandwidth() / 2)
    .attr('y', (data) => y(chooseField(data, fieldToUse)) - 20)
    .attr('text-anchor', 'middle')
    .classed('label', true);
};

const createSVG = (WIDTH, HEIGHT, fieldReceived, type) => {
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

const chooseField = (country, fieldReceived) => {
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

const createSVGWidthContent = (content, fieldReceived, type) => {
  const svgDivContent = content;
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const svgID = generateID();

  svg.setAttribute('id', svgID);
  svg.classList.add(fieldReceived);
  svg.classList.add(type);

  svgDivContent.append(svg);
  return svgID;
};

const saveToLocalStorage = (chartObject) => {
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

export const createDonutChart = (
  rawCountries,
  fieldReceived,
  width,
  height,
  svg,
  local
) => {
  const countries = getFilteredCountries(rawCountries, 'donut');

  let fieldToUse;
  if (fieldReceived) fieldToUse = fieldReceived;

  let content;
  if (svg) {
    fieldToUse = svg.classList[0];
    content = svg.parentNode;
    svg.remove();
  }

  if (!svg && !local) saveToLocalStorage({ field: fieldToUse, type: 'donut' });

  const MARGINS = { top: 20, bottom: 20, right: 20, left: 45 };
  const CHART_WIDTH = width - MARGINS.left - MARGINS.right;
  const CHART_HEIGHT = height - MARGINS.top - MARGINS.bottom;

  // const AUGMENTED_SCALE = 10000000;

  let svgID;
  if (!svg) {
    svgID = createSVG(
      CHART_WIDTH + MARGINS.left + MARGINS.right,
      CHART_HEIGHT + MARGINS.top + MARGINS.bottom,
      fieldToUse,
      'donut'
    );
  } else {
    svgID = createSVGWidthContent(content, fieldToUse, 'donut');
  }

  // const x = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
  // const y = d3.scaleLinear().range([CHART_HEIGHT, 0]);

  const chart = d3
    .select(`#${svgID}`)
    .attr('width', CHART_WIDTH + MARGINS.left + MARGINS.right)
    .attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom)
    .append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top + ')');

  const pieContainer = chart
    .append('g')
    .attr(
      'transform',
      'translate(' + CHART_WIDTH / 2 + ' ' + CHART_HEIGHT / 2 + ')'
    );

  const colors = (i) => d3.interpolateReds(i / 6);

  const arc = d3
    .arc()
    .outerRadius((CHART_HEIGHT / 2) * 0.6)
    .innerRadius((CHART_HEIGHT / 2) * 0.3);

  const popupArc = d3
    .arc()
    .outerRadius((CHART_HEIGHT / 2) * 0.65)
    .innerRadius((CHART_HEIGHT / 2) * 0.3);

  const labelsArc = d3
    .arc()
    .outerRadius((CHART_HEIGHT / 2) * 0.7)
    .innerRadius((CHART_HEIGHT / 2) * 0.7);

  pieContainer
    .append('path')
    .attr('class', 'backgroundArc')
    .attr('d', arc({ startAngle: 0, endAngle: 2 * Math.PI }));

  const filtered = countries.map((c) => c.TotalDeaths);
  let totalCases = 0;
  countries.forEach((c) => (totalCases += c.TotalConfirmed));

  const totalDeaths = filtered.reduce((a, b) => a + b, 0);

  const pie = d3
    .pie()
    .sort(null)
    .padAngle(0.04)
    .value((d) => d);

  const arcs = pie(filtered);
  arcs.forEach((arc) => {
    countries.forEach((c) => {
      if (c.TotalDeaths === arc.data) {
        arc.label = c.CountryCode;
      }
    });
  });
  const arcElements = pieContainer.selectAll('.arc').data(arcs);

  arcElements
    .enter()
    .append('path')
    .attr('class', 'arc')
    .style('fill', (d, i) => colors(i))
    .merge(arcElements)
    .on('mouseover', function (d) {
      d3.select(this).attr('d', function (d) {
        return popupArc(d);
      });
      let centerText = pieContainer.selectAll('.center').data([d]);
      centerText
        .enter()
        .append('text')
        .attr('class', 'center')
        .style('text-anchor', 'middle')
        .merge(centerText)
        .text(function (d) {
          return (
            Math.round((d.toElement.__data__.data / totalDeaths) * 100) + '%'
          );
        });
    })
    .on('mouseout', function (d) {
      d3.select(this).attr('d', function (d) {
        return arc(d);
      });
      pieContainer.selectAll('.center').text('');
    })
    .transition()
    .ease(d3.easeCircle)
    .duration(2000)
    .attrTween('d', tweenArcs);

  const textElements = pieContainer.selectAll('.labels').data(arcs);

  textElements
    .enter()
    .append('text')
    .attr('class', 'labels')
    .merge(textElements)
    .text(function (d) {
      return `${d.label}(${d.data})`;
    })
    .style('font-size', '13px')
    .attr('dy', '0.35em')
    .transition()
    .ease(d3.easeCircle)
    .duration(2000)
    .attrTween('transform', tweenLabels)
    .styleTween('text-anchor', tweenAnchor);

  const lineElements = pieContainer.selectAll('.lines').data(arcs);
  lineElements
    .enter()
    .append('path')
    .attr('class', 'lines')
    .merge(lineElements)
    .transition()
    .ease(d3.easeCircle)
    .duration(2000)
    .attrTween('d', tweenLines);

  function tweenAnchor(d) {
    const interpolator = getArcInterpolator(this, d);
    return function (t) {
      const x = labelsArc.centroid(interpolator(t))[0];
      return x > 0 ? 'start' : 'end';
    };
  }

  function tweenLines(d) {
    const interpolator = getArcInterpolator(this, d);
    const lineGen = d3.line();
    return function (t) {
      const dInt = interpolator(t);
      const start = arc.centroid(dInt);
      const xy = labelsArc.centroid(dInt);
      let textXy = [xy[0], xy[1]];
      textXy[0] = textXy[0] * 1.15;
      return lineGen([start, xy, textXy]);
    };
  }

  function tweenLabels(d) {
    const interpolator = getArcInterpolator(this, d);
    return function (t) {
      const p = labelsArc.centroid(interpolator(t));
      let xy = p;
      xy[0] = xy[0] * 1.2;
      return 'translate(' + xy + ')';
    };
  }

  function tweenArcs(d) {
    var interpolator = getArcInterpolator(this, d);
    return function (t) {
      return arc(interpolator(t));
    };
  }

  function getArcInterpolator(el, d) {
    var oldValue = el._oldValue;
    const interpolator = d3.interpolate(
      {
        startAngle: oldValue ? oldValue.startAngle : 0,
        endAngle: oldValue ? oldValue.endAngle : 0,
      },
      d
    );
    el._oldValue = interpolator(0);

    return interpolator;
  }
};

const getFilteredCountries = (raw, type) => {
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
