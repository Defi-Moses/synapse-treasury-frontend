// treasury-frontend/pages/components/PieChart.js
import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import formatToDollar from '@/utils/helpers'
import styles from './pieChart.module.scss'
import Card from '@/components/library/Card'

const PieChart = () => {
  const ref = useRef()
  const [data, setData] = useState(null)
  const [legendData, setLegendData] = useState([])
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

  useEffect(() => {
    fetch('/api/data?file=sums.csv&type=summary')
      .then((response) => response.json())
      .then((data) => {
        setData(data)
        setLegendData(Object.keys(data))
      })
      .catch((error) => console.error('Error:', error))
  }, [])

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      const svg = d3.select(ref.current)
      const width = svg.node().getBoundingClientRect().width
      const height = svg.node().getBoundingClientRect().height
      const radius = (Math.min(width, height) * 0.8) / 2

      // const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
      const tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0)

      svg.attr('viewBox', [-width / 2, -height / 2, width, height])

      const pie = d3.pie().value((d) => d[1])(Object.entries(data))

      const arc = d3.arc().innerRadius(0).outerRadius(radius)

      svg
        .selectAll('path')
        .data(pie)
        .join('path')
        .attr('d', arc)
        .attr('fill', (d, i) => colorScale(i))
        .on('mouseover', (event, d) => {
          tooltip.transition().duration(200).style('opacity', 0.9)
          tooltip
            .html(`${d.data[0]}: ${formatToDollar(d.data[1])}`)
            .style('left', event.pageX + 'px')
            .style('top', event.pageY - 28 + 'px')
        })
        .on('mouseout', (d) => {
          tooltip.transition().duration(500).style('opacity', 0)
        })
    }
  }, [data])

  if (!data) return <p>Loading...</p>
  return (
    <Card>
      <div className='flex justify-center font-bold text-white w-full'>
        {`Total Treasury: ${formatToDollar(Object.values(data).reduce((a, b) => a + b, 0))}`}
      </div>
      <div className={`flex flex-col md:flex-row justify-center items-center px-4`}>
        <svg ref={ref} className={styles.chart} />
        <div className={styles.legend}>
          {legendData.map((key, i) => (
            <div key={key} className={styles.legendItem}>
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  backgroundColor: colorScale(i),
                }}
              ></div>
              <span className='ml-2 mr-2 text-white'>{key}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default PieChart
