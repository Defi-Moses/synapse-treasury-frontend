// treasury-frontend/components/pastHoldings.js
import { use, useEffect, useState } from 'react'
import * as d3 from 'd3'
import formatToDollar from '../utils/helpers'
import { gql, useQuery, useLazyQuery } from '@apollo/client'
import { GET_HISTORICAL_FEES } from '../graphql/queries/index'
import Row from '../components/rowComponent'
import Card from './library/Card'
import styles from './pastHoldings.module.scss'
import Badge from './library/Badge'

const MonthList = () => {
  const [csvData, setCsvData] = useState(null)
  const [monthlyFees, setMonthlyFees] = useState({})
  const [tokenData, setTokenData] = useState(null)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
  const { loading, error, data } = useQuery(GET_HISTORICAL_FEES)

  const categories = [
    { category: 'Fees', color: '#1f77b4' },
    { category: 'Total Holdings', color: '#ff7f0e' },
  ]

  const isDesktop = () => window.innerWidth > 768 // Change 768 to your desired breakpoint

  useEffect(() => {
    const months = Array.from({ length: 9 }, (_, i) => i + 1) // Months from 1 to 12

    // Fetch treasury sums
    Promise.all(
      months.map((month) =>
        fetch(`/api/data?file=treasurySums_${month}_2023.csv&type=summary`).then((response) => response.json())
      )
    )
      .then((csvData) => {
        const monthlyTotals = csvData.reduce((acc, curr, index) => {
          // Sum up the values
          acc[months[index]] = Object.values(curr).reduce((a, b) => a + b, 0)
          return acc
        }, {})
        setCsvData(monthlyTotals)
      })
      .catch((error) => console.error('Error:', error))

    // Fetch token data
    Promise.all(
      months.map((month) =>
        fetch(`/api/data?file=treasuryHoldings_${month}_2023.csv&type=breakdown`).then((response) => response.json())
      )
    )
      .then((monthlyData) => {
        const sortedMonthlyData = monthlyData.map((data) => {
          const sortedData = Object.entries(data)
            .filter(([key]) => key !== 'SYN')
            .sort((a, b) => b[1] - a[1])
            .slice(0, 15)
          return sortedData
        })
        setTokenData(sortedMonthlyData)
      })
      .catch((error) => console.error('Error:', error))

    if (data && data.dailyStatisticsByChain) {
      const monthlyFees = data.dailyStatisticsByChain.reduce((acc, curr) => {
        const month = new Date(curr['date']).getMonth() + 1
        acc[month] = (acc[month] || 0) + curr.total
        return acc
      }, {})
      setMonthlyFees(monthlyFees)
    }
  }, [data, loading, error])

  useEffect(() => {
    if (!csvData) return
    const rawData = Object.entries(csvData).map(([key, value], index) => {
      const month = monthNames[key - 1] ? `${monthNames[key - 1]} 2023` : '0'
      const fee = monthlyFees[key] ? formatToDollar(monthlyFees[key]) : '0'
      const holding = value ? formatToDollar(value) : '0'
      const currentTokenData = tokenData && tokenData[index] ? tokenData[index] : '0'

      return { month, Fees: fee, TotalHoldings: holding }
    })

    const convertToNumber = (currency) => {
      return Number(currency.replace(/[^0-9.-]+/g, ''))
    }

    const data = rawData.map((d) => ({
      month: d.month,
      Fees: convertToNumber(d.Fees),
      TotalHoldings: convertToNumber(d.TotalHoldings),
    }))

    const stack = (d) => {
      const total = d.Fees + d.TotalHoldings
      return [
        { key: 'TotalHoldings', value: d.TotalHoldings, y1: 0, y0: d.TotalHoldings },
        { key: 'Fees', value: d.Fees, y1: d.TotalHoldings, y0: total },
      ]
    }

    // Transform data for stacked representation
    const stackedData = data.map((d) => ({
      month: d.month,
      stack: stack(d),
    }))

    const margin = { top: 20, right: 20, bottom: 20, left: 70 },
      width = 320 - margin.left - margin.right,
      height = 420 - margin.top - margin.bottom

    const svg = d3
      .select('#chart')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom + 50)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    // Tooltip
    const tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0)

    const y0 = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .rangeRound([height, 0])
      .paddingInner(0.5) // Increase this value to add more space between bars

    const y1 = d3.scaleBand().domain(['Fees', 'TotalHoldings']).rangeRound([0, y0.bandwidth()]).padding(0.4) // Increase this value to make each bar thinner

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => Math.max(d.Fees, d.TotalHoldings))])
      .rangeRound([0, width])

    const yAxis = d3.axisLeft(y0)
    const xAxis = d3.axisBottom(x).tickFormat((d) => `$${d / 1e6}m`)

    svg.append('g').call(yAxis)

    svg.append('g').attr('transform', `translate(0, ${height})`).call(xAxis)

    // Create the bars
    const month = svg
      .selectAll('.month')
      .data(stackedData)
      .enter()
      .append('g')
      .attr('class', 'month')
      .attr('transform', (d) => `translate(0, ${y0(d.month)})`)

    month
      .selectAll('rect')
      .data((d) => d.stack)
      .enter()
      .append('rect')
      .attr('y', 0)
      .attr('x', (d) => x(d.y1))
      .attr('height', y0.bandwidth())
      .attr('width', (d) => x(d.y0) - x(d.y1))
      .attr('fill', (d) => (d.key === 'Fees' ? '#1f77b4' : '#ff7f0e'))
      .on('mouseover', function (event, d) {
        tooltip.transition().duration(200).style('opacity', 0.9)
        tooltip
          .html(`${d.key}: ${formatToDollar(d.value)}`)
          .style('left', `${event.pageX}px`)
          .style('top', `${event.pageY - 28}px`)
      })
      .on('mouseout', function () {
        tooltip.transition().duration(500).style('opacity', 0)
      })
      .on('click', function (event, d, i) {
        console.log(`Clicked on ${d.key} bar for the month of ${d.month} at index ${i}`)
      })
  }, [csvData])

  if (!csvData || !data || !tokenData) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <Badge sticky>Historical Data - Fees & Holdings</Badge>

      <svg id='chart'></svg>
      <div className='flex gap-[0.5rem] items-center justify-center'>
        {categories.map(({ category, color }) => {
          return (
            <>
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  backgroundColor: color,
                }}
              />

              <div>{category}</div>
            </>
          )
        })}
      </div>
      <sup className='mt-4'>Select a month to see detailed breakthrough</sup>

      {/* Tooltip styles */}
      <style>{`
        .tooltip {
          position: absolute;
          text-align: center;
          width: 80px;
          height: 40px;
          padding: 2px;
          font: 12px sans-serif;
          background: lightsteelblue;
          border: 0px;
          border-radius: 8px;
          pointer-events: none;
        }
      `}</style>
    </Card>
  )
}

export default MonthList
