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
      // const legend = svg.selectAll('.legend')
      //   .data(Object.keys(data)) // Use data keys for legend
      //   .enter()
      //   .append('g')
      //   .attr('class', 'legend')
      //   .attr('transform', (d, i) => `translate(0,${i * 20})`); // Adjust position here
      
      // legend.append('rect')
      //   .attr('x', 0) // Adjust position here
      //   .attr('width', 18)
      //   .attr('height', 18)
      //   .style('fill', (d, i) => colorScale(i)); // Use index to get color
      
      // legend.append('text')
      //   .attr('x', 24) // Adjust position here
      //   .attr('y', 9)
      //   .attr('dy', '.35em')
      //   .style('text-anchor', 'start') // Change anchor to 'start'
      //   .text((d) => d); // Use data key for text
    }
  }, [data]);



  if (!data) return <p>Loading...</p>
  return (
    <div className="flex flex-col items-start border rounded-lg py-8">
      {/* <svg className="w-1/4 h-20 p-4">
        {legendData.map((key, i) => (
          <g key={key} transform={`translate(0,${i * 20})`}>
            <rect x={0} width={18} height={18} fill={colorScale(i)} />
            <text x={24} y={9} dy=".35em" fill="white">{key}</text>
          </g>
        ))}
      </svg> */}
      <div className="flex justify-center items-center">
        <svg ref={ref} className="w-full h-full"/>
      </div>
      <div className="absolute bottom-0 right-0 p-2">
        {`Total Treasury: ${formatToDollar(Object.values(data).reduce((a, b) => a + b, 0))}`}
      </div>
    </div>
  );
}

export default PieChart