import {
  createSVG,
  chooseField,
  createSVGWidthContent,
  saveToLocalStorage,
  getFilteredCountries,
} from './common.js';
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

export const createLineChart = (
  allDataCountry,
  fieldReceived,
  width,
  height,
  svg,
  local
) => {
  let fieldToUse;
  if (fieldReceived) fieldToUse = fieldReceived;

  let content;
  if (svg) {
    fieldToUse = svg.classList[0];
    content = svg.parentNode;
    svg.remove();
  }

  if (!svg && !local) saveToLocalStorage({ field: fieldToUse, type: 'line' });

  const MARGINS = { top: 20, bottom: 20, right: 20, left: 60 };
  const CHART_WIDTH = width - MARGINS.left - MARGINS.right;
  const CHART_HEIGHT = height - MARGINS.top - MARGINS.bottom;

  const AUGMENTED_SCALE = 1000000;

  let svgID;
  if (!svg) {
    svgID = createSVG(
      CHART_WIDTH + MARGINS.left + MARGINS.right,
      CHART_HEIGHT + MARGINS.top + MARGINS.bottom,
      fieldToUse,
      'line'
    );
  } else {
    svgID = createSVGWidthContent(content, fieldToUse, 'line');
  }

  let data = [];
  const date = new Date(new Date().getTime() - 86400000 * 5);
  const filteredData = allDataCountry.filter((ct) => new Date(ct.Date) > date);
  const simplifiedArr = filteredData.map((c) => {
    const newDate = new Date(c.Date);
    const formattedDate = `${newDate.getDay()}/${newDate.getMonth()}/${newDate.getFullYear()}`;
    return { date: formattedDate, cases: c.Confirmed };
  });
  simplifiedArr.forEach((e) => data.push(e));

  let chart = d3
    .select(`#${svgID}`)
    .attr('width', CHART_WIDTH + MARGINS.left + MARGINS.right)
    .attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom);

  let mainGraph = chart
    .append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top + ')');

  let categoriesNames = data.map((d) => d.date);
  let xScale = d3.scalePoint().domain(categoriesNames).range([0, CHART_WIDTH]);
  var yScale = d3
    .scaleLinear()
    .range([CHART_HEIGHT, 0])
    .domain([
      // 0,
      d3.min(data, (data) => data.cases),
      d3.max(data, (data) => data.cases),
    ]);

  mainGraph
    .append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + CHART_HEIGHT + ')')
    .call(d3.axisBottom(xScale));

  mainGraph.append('g').attr('class', 'y axis').call(d3.axisLeft(yScale));

  var line = d3
    .line()
    .x(function (d) {
      return xScale(d.date);
    }) // set the x value
    .y(function (d) {
      return yScale(d.cases);
    }) // set the y value
    .curve(d3.curveMonotoneX); // apply smoothing to the line

  mainGraph
    .append('path')
    .datum(data)
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1.5); // generate line
};

export const createMapChart = (
  allCountries,
  fieldReceived,
  width,
  height,
  svG,
  local
) => {
  let fieldToUse;
  if (fieldReceived) fieldToUse = fieldReceived;

  let content;
  if (svG) {
    fieldToUse = svG.classList[0];
    content = svG.parentNode;
    svG.remove();
  }

  if (!svG && !local) saveToLocalStorage({ field: fieldToUse, type: 'map' });

  const MARGINS = { top: 10, bottom: 10, right: 60, left: 45 };
  const CHART_WIDTH = width - MARGINS.left - MARGINS.right;
  const CHART_HEIGHT = height - MARGINS.top - MARGINS.bottom;

  let svgID;
  if (!svG) {
    svgID = createSVG(
      CHART_WIDTH + MARGINS.left + MARGINS.right,
      CHART_HEIGHT + MARGINS.top + MARGINS.bottom,
      fieldToUse,
      'map'
    );
  } else {
    svgID = createSVGWidthContent(content, fieldToUse, 'map');
  }

  var svg = d3
    .select(`#${svgID}`)
    // .attr('id', 'SVG_' + id_area)
    .attr('width', CHART_WIDTH + MARGINS.left + MARGINS.right)
    .attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom);

  var color = d3
    .scaleThreshold()
    .domain([
      0, 10000, 100000, 500000, 1000000, 5000000, 10000000, 50000000, 100000000,
      500000000, 1500000000,
    ])
    .range([
      'rgb(247,251,255)',
      'rgb(222,235,247)',
      'rgb(198,219,239)',
      'rgb(158,202,225)',
      'rgb(107,174,214)',
      'rgb(66,146,198)',
      'rgb(33,113,181)',
      'rgb(8,81,156)',
      'rgb(8,48,107)',
      'rgb(3,19,43)',
      'rgb(0,0,0)',
    ]);

  // Data and color scale
  var projection = d3
    .geoMercator()
    .scale(100)
    .translate([width / 2, height / 1.5]);

  var path = d3.geoPath().projection(projection);

  $.ajax({
    type: 'GET',
    url: 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson',
    success: function (data) {
      d3.json = data;

      $.ajax({
        type: 'GET',
        url: 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv',
        success: function (data) {
          d3.csv = data;

          ready(d3.json, d3.csv);
        },
      });
    },
  });

  function ready(data, population) {
    data = JSON.parse(data);

    data.features.forEach((f) => {
      allCountries.forEach((c) => {
        if (c.Country === f.properties.name) {
          f.cases = c.TotalConfirmed;
        }
      });
    });

    var tooltip = d3
      .select('.main')
      .append('div')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('width', '120px')
      .style('background-color', 'black')
      .style('color', '#fff')
      .style('text-align', 'center')
      .style('border-radius', '6px')
      .style('padding', '5px 0')
      .style('z-index', '1000')
      .text('No information');

    svg
      .append('g')
      .attr('class', 'countries')
      .selectAll('path')
      .data(data.features)
      .enter()
      .append('path')
      .attr('d', path)
      .style('fill', function (d) {
        if (d.cases !== undefined) {
          return color(d.cases);
        } else {
          return color(0);
        }
      })
      .style('stroke', 'white')
      .style('stroke-width', 1.5)
      .style('opacity', 0.8)
      .style('stroke', 'white')
      .style('stroke-width', 0.3)
      .on('mouseover', function (d) {
        tooltip.style('visibility', 'visible');
        if (d.toElement.__data__.cases === undefined) {
          tooltip.text(
            `No information about ${d.toElement.__data__.properties.name}`
          );
        } else {
          tooltip.text(
            `${d.toElement.__data__.properties.name} - ${d.toElement.__data__.cases} cases`
          );
        }
        d3.select(this)
          .style('opacity', 1)
          .style('stroke', 'white')
          .style('stroke-width', 3);
      })
      .on('mousemove', function (d) {
        return tooltip
          .style('top', d.screenY + 'px')
          .style('left', d.screenX + 'px');
      })
      .on('mouseout', function (d) {
        tooltip.style('visibility', 'hidden');
        tooltip.text('');

        d3.select(this)
          .style('opacity', 0.8)
          .style('stroke', 'white')
          .style('stroke-width', 0.3);
      });
  }
};

export const createBubbleChart = (
  allCountries,
  fieldReceived,
  width,
  height,
  svG,
  local
) => {
  let fieldToUse;
  if (fieldReceived) fieldToUse = fieldReceived;

  let content;
  if (svG) {
    fieldToUse = svG.classList[0];
    content = svG.parentNode;
    svG.remove();
  }

  if (!svG && !local) saveToLocalStorage({ field: fieldToUse, type: 'bubble' });

  const MARGINS = { top: 10, bottom: 20, right: 30, left: 50 };
  const CHART_WIDTH = width - MARGINS.left - MARGINS.right;
  const CHART_HEIGHT = height - MARGINS.top - MARGINS.bottom;

  let svgID;
  if (!svG) {
    svgID = createSVG(
      CHART_WIDTH + MARGINS.left + MARGINS.right,
      CHART_HEIGHT + MARGINS.top + MARGINS.bottom,
      fieldToUse,
      'bubble'
    );
  } else {
    svgID = createSVGWidthContent(content, fieldToUse, 'bubble');
  }

  var svg = d3
    .select(`#${svgID}`)
    .attr('width', CHART_WIDTH + MARGINS.left + MARGINS.right)
    .attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom)
    .append('g')
    .attr('transform', 'translate(' + MARGINS.left + ',' + MARGINS.top + ')');

  var data = allCountries;

  // Add X axis
  var x = d3.scaleLinear().domain([0, 700]).range([0, CHART_WIDTH]);
  svg
    .append('g')
    .attr('transform', 'translate(0,' + CHART_HEIGHT + ')')
    .call(d3.axisBottom(x))
    .style('font-size', '8px');

  // Add Y axis
  var y = d3.scaleLinear().domain([0, 25000]).range([CHART_HEIGHT, 0]);
  svg.append('g').call(d3.axisLeft(y));

  // Add a scale for bubble size
  var z = d3.scaleLinear().domain([200000, 90000000]).range([4, 40]);

  // Add a scale for bubble color
  var myColor = d3.scaleOrdinal().domain([0, 10000]).range(d3.schemeSet2);

  var tooltip = d3
    .select('.main')
    .append('div')
    .style('position', 'absolute')
    .style('visibility', 'hidden')
    .style('background-color', 'black')
    .style('color', '#fff')
    .style('text-align', 'center')
    .style('border-radius', '6px')
    .style('padding', '5px 0')
    .style('z-index', '1000');

  var showTooltip = function (d) {
    tooltip.style('visibility', 'visible');
    tooltip.html(`Country: ${d.toElement.__data__.Country}<br/>
            New deaths: ${d.toElement.__data__.NewDeaths}<br/>
            New recovered: ${d.toElement.__data__.NewRecovered}<br/>
            New confirmed: ${d.toElement.__data__.NewConfirmed}`);
  };
  var moveTooltip = function (d) {
    return tooltip
      .style('top', d.screenY / 2 + 'px')
      .style('left', d.screenX + 'px');
  };
  var hideTooltip = function (d) {
    tooltip.style('visibility', 'hidden');
    tooltip.text('');
  };

  // Add dots
  svg
    .append('g')
    .selectAll('dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'bubbles')
    .attr('cx', function (d) {
      return x(d.NewDeaths);
    })
    .attr('cy', function (d) {
      return y(d.NewRecovered);
    })
    .attr('r', function (d) {
      return z(d.NewConfirmed);
    })
    .style('fill', function (d) {
      return myColor(d.NewDeaths);
    })
    .on('mouseover', showTooltip)
    .on('mousemove', moveTooltip)
    .on('mouseleave', hideTooltip);
};

export const createCircularBarPlotChart = (
  allCountries,
  fieldReceived,
  width,
  height,
  svG,
  local
) => {
  let fieldToUse;
  if (fieldReceived) fieldToUse = fieldReceived;

  let content;
  if (svG) {
    fieldToUse = svG.classList[0];
    content = svG.parentNode;
    svG.remove();
  }

  if (!svG && !local)
    saveToLocalStorage({ field: fieldToUse, type: 'circular' });

  const MARGINS = { top: 100, bottom: 0, right: 0, left: 0 };
  const CHART_WIDTH = width - MARGINS.left - MARGINS.right;
  const CHART_HEIGHT = height - MARGINS.top - MARGINS.bottom;
  const innerRadius = 90;
  const outerRadius = Math.min(CHART_WIDTH, CHART_HEIGHT) / 2; // the outerRadius goes from the middle of the SVG area to the border

  let svgID;
  if (!svG) {
    svgID = createSVG(
      CHART_WIDTH + MARGINS.left + MARGINS.right,
      CHART_HEIGHT + MARGINS.top + MARGINS.bottom,
      fieldToUse,
      'circular'
    );
  } else {
    svgID = createSVGWidthContent(content, fieldToUse, 'circular');
  }

  // append the svg object
  var svg = d3
    .select(`#${svgID}`)
    .attr('width', CHART_WIDTH + MARGINS.left + MARGINS.right)
    .attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom)
    .append('g')
    .attr(
      'transform',
      'translate(' +
        (CHART_WIDTH / 2 + MARGINS.left) +
        ',' +
        (CHART_HEIGHT / 2 + MARGINS.top) +
        ')'
    );

  const data = allCountries
    .sort((a, b) => {
      if (a.TotalRecovered < b.TotalRecovered) {
        return 1;
      }
      return -1;
    })
    .slice(0, 50); // first 50 countries with most recovers

  const tooltip = d3
    .select('.main')
    .append('div')
    .style('position', 'absolute')
    .style('visibility', 'hidden')
    .style('width', '120px')
    .style('background-color', 'black')
    .style('color', '#fff')
    .style('text-align', 'center')
    .style('border-radius', '6px')
    .style('padding', '5px 0')
    .style('z-index', '1000')
    .text('No information');

  // Scales
  var x = d3
    .scaleBand()
    .range([0, 2 * Math.PI]) // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
    .align(0) // This does nothing
    .domain(
      data.map(function (d) {
        return d.Country;
      })
    ); // The domain of the X axis is the list of states.

  var y = d3
    .scaleRadial()
    .range([innerRadius, outerRadius]) // Domain will be define later.
    .domain([0, 15000000]); // Domain of Y is from 0 to the max seen in the data

  // Add the bars
  svg
    .append('g')
    .selectAll('path')
    .data(data)
    .enter()
    .append('path')
    .attr('fill', '#69b3a2')
    .attr(
      'd',
      d3
        .arc() // imagine your doing a part of a donut plot
        .innerRadius(innerRadius)
        .outerRadius(function (d) {
          return y(d['TotalRecovered']);
        })
        .startAngle(function (d) {
          return x(d.Country);
        })
        .endAngle(function (d) {
          return x(d.Country) + x.bandwidth();
        })
        .padAngle(0.01)
        .padRadius(innerRadius)
    );

  // Add the labels
  svg
    .append('g')
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('text-anchor', function (d) {
      return (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) <
        Math.PI
        ? 'end'
        : 'start';
    })
    .attr('transform', function (d) {
      return (
        'rotate(' +
        (((x(d.Country) + x.bandwidth() / 2) * 180) / Math.PI - 90) +
        ')' +
        'translate(' +
        (y(d['TotalRecovered']) + 10) +
        ',0)'
      );
    })
    .append('text')
    .text(function (d) {
      return d.Country;
    })
    .attr('transform', function (d) {
      return (x(d.Country) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) <
        Math.PI
        ? 'rotate(180)'
        : 'rotate(0)';
    })
    .style('font-size', '11px')
    .attr('alignment-baseline', 'middle')
    .on('mouseover', function (d) {
      tooltip.style('visibility', 'visible');
      tooltip.html(
        `${d.toElement.__data__.Country}<br/> 
        Total: ${d.toElement.__data__.TotalConfirmed}<br/> 
        Recovered: ${d.toElement.__data__.TotalRecovered}`
      );
      d3.select(this).style('opacity', 0.8);
    })
    .on('mousemove', function (d) {
      return tooltip
        .style('top', d.screenY + 'px')
        .style('left', d.screenX + 'px');
    })
    .on('mouseout', function (d) {
      tooltip.style('visibility', 'hidden');
      tooltip.text('');

      d3.select(this).style('opacity', 1);
    });
};
