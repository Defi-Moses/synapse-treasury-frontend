// treasury-frontend/pages/components/PieChart.js
import * as d3 from 'd3'
import { useEffect, useRef, useState } from 'react'
import formatToDollar from '@/utils/helpers'
import styles from './pieChart.module.scss'
import Card from '@/components/library/Card'
import Loader from '@/components/library/Loader'
import Badge from './library/Badge'
import { chartColorPalette } from '@/src/app/constants'

const PieChart = () => {
  const ref = useRef()
  const [data, setData] = useState([])

  useEffect(() => {
    fetch('/api/data?file=sums.csv&type=summary')
      .then((response) => response.json())
      .then((data) => {
        const coloredData = Object.entries(data).reduce((acc, [key, value], index) => {
          acc[key] = {
            name: key,
            value: value,
            color: chartColorPalette[index],
          }
          return acc
        }, {})

        const array = Object.values(coloredData)
        setData(array)
      })
      .catch((error) => console.error('Error:', error))
  }, [])

  useEffect(() => {
    if (data?.length) {
      const svg = d3.select(ref.current)
      const width = svg.node().getBoundingClientRect().width
      const height = svg.node().getBoundingClientRect().height
      const radius = (Math.min(width, height) * 0.8) / 2

      const tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)
        .style('background', '#333')
        .style('padding', '8px')
        .style('border-radius', '4px')
        .style('color', '#fff')
        .style('height', 'fit-content')

      svg.attr('viewBox', [-width / 2, -height / 2, width, height])

      const pie = d3.pie().value((d) => d.value)(data)

      const arc = d3
        .arc()
        // Pie Chart
        // .innerRadius(0)
        // .outerRadius(radius - 10)

        // Donut
        .innerRadius(radius * 0.5)
        .outerRadius(radius - 10)

        // Cut-out effect
        .cornerRadius(5)
        .padAngle(0.02)

      svg
        .selectAll('path')
        .data(pie)
        .join('path')
        .attr('d', arc)
        .attr('fill', (d) => d.data.color)
        .style('cursor', 'pointer')
        .on('mouseover', (event, d) => {
          tooltip.transition().duration(200).style('opacity', 0.9)
          tooltip
            .html(`${d.data.name}: ${formatToDollar(d.data.value)}`)
            .style('left', event.pageX + 'px')
            .style('top', event.pageY - 28 + 'px')
        })
        .on('mouseout', (d) => {
          tooltip.transition().duration(500).style('opacity', 0)
        })
    }
  }, [data])

  if (!data?.length)
    return (
      <Card className={styles.chartCard}>
        <div className='flex h-full w-full items-center justify-center'>
          <Loader />
        </div>
      </Card>
    )
  return (
    <Card className={styles.chartCard}>
      <div className='flex justify-center font-bold text-white w-full '>
        <Badge sticky>
          Total Treasury:
          <span className='font-bold'> {formatToDollar(data.reduce((acc, curr) => acc + curr.value, 0))}</span>
        </Badge>
      </div>
      <div className={`flex flex-col md:flex-row justify-center items-center px-4`}>
        <svg ref={ref} className={styles.chart} />
        <div className={styles.legend}>
          {data
            .sort((a, b) => a - b)
            .map((item, i) => (
              <div key={i} className={styles.legendItem}>
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    backgroundColor: item.color,
                  }}
                ></div>
                <span className={styles.legendText}>{item.name}</span>
              </div>
            ))}
        </div>
      </div>
    </Card>
  )
}

export default PieChart
