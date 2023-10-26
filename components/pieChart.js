// treasury-frontend/pages/components/PieChart.js
import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import formatToDollar from '../utils/helpers'

const PieChart = () => {
  const ref = useRef();
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/data?file=sums.csv&type=summary')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error:', error));
  }, []);

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      const svg = d3.select(ref.current);
      const width = svg.node().getBoundingClientRect().width;
      const height = svg.node().getBoundingClientRect().height;
      const radius = Math.min(width, height) * 0.8 / 2;

      const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      svg.attr('viewBox', [-width / 2, -height / 2, width, height]);

      const pie = d3.pie().value(d => d[1])(Object.entries(data));

      const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius)

      console.log(pie)


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
    <div className="flex justify-center items-center border rounded-lg py-8">
      <svg ref={ref} className="w-full h-full"/>
      <div className="absolute bottom-0 right-0 p-2">
      {`Total Treasury: ${formatToDollar(Object.values(data).reduce((a, b) => a + b, 0))}`}
      </div>
    </div>
  );
}

export default PieChart