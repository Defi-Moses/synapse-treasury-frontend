// treasury-frontend/pages/components/PieChart.js
import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import formatToDollar from '../utils/helpers'

const PieChart = () => {
  const ref = useRef();
  const [data, setData] = useState(null);
  const [legendData, setLegendData] = useState([]);
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  useEffect(() => {
    fetch('/api/data?file=sums.csv&type=summary')
      .then(response => response.json())
      .then(data => {
        setData(data)
        setLegendData(Object.keys(data))
      })
      .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      const svg = d3.select(ref.current);
      const width = svg.node().getBoundingClientRect().width;
      const height = svg.node().getBoundingClientRect().height;
      const radius = Math.min(width, height) * 0.8 / 2;

      // const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      svg.attr('viewBox', [-width / 2, -height / 2, width, height]);

      const pie = d3.pie().value(d => d[1])(Object.entries(data));

      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

      svg
      .selectAll('path')
      .data(pie)
      .join('path')
      .attr('d', arc)
      .attr('fill', (d,i) => colorScale(i))
      .on('mouseover', (event, d) => {
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        tooltip.html(`${d.data[0]}: ${formatToDollar(d.data[1])}`)
          .style("left", (event.pageX) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on('mouseout', (d) => {
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });
    }
  }, [data]);



  if (!data) return <p>Loading...</p>
  return (
    <div className="flex flex-col items-start border rounded-lg py-8 px-4 ml-4">

    <div className="flex flex-row justify-center items-center">
      <svg className="w-1/4 py-4 ml-8" style={{ height: `${legendData.length * 28}px` }}>
        {legendData.map((key, i) => (
          <g key={key} transform={`translate(0,${i * 20})`}>
            <rect x={0} width={18} height={18} fill={colorScale(i)} />
            <text x={24} y={9} dy=".35em" fill="white">{key}</text>
          </g>
        ))}
      </svg>
      <svg ref={ref} className=""/>
    </div>

    <div className="p-8 font-bold">
      {`Total Treasury: ${formatToDollar(Object.values(data).reduce((a, b) => a + b, 0))}`}
    </div>
    </div>
  );
}

export default PieChart