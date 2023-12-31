// treasury-frontend/components/pastHoldings.js
import { use, useEffect, useState } from 'react'
import formatToDollar from '../utils/helpers'
import { gql, useQuery, useLazyQuery } from '@apollo/client'
import { GET_HISTORICAL_FEES } from '../graphql/queries/index'
import Row from '../components/rowComponent'
import Card from './library/Card'
import styles from './pastHoldings.module.scss'
import Badge from '@/components/library/Badge'
import Loader from './library/Loader'

const MonthList = () => {
  const [csvData, setCsvData] = useState(null)
  const [monthlyFees, setMonthlyFees] = useState({})
  const [tokenData, setTokenData] = useState(null)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
  const { loading, error, data } = useQuery(GET_HISTORICAL_FEES)

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
            .map(([key, value]) => {
              const normalizedKey = key.split(' ')[0]
              return [normalizedKey, value]
            })
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

  if (!csvData || !data || !tokenData) {
    return (
      <Card className={styles.card}>
        <div className='flex h-full w-full items-center justify-center'>
          <Loader />
        </div>
      </Card>
    )
  }

  return (
    <Card className={styles.card}>
      <Badge sticky>Historical Data</Badge>
      <div className={styles.headings}>
        <div className={styles.heading}>Date</div>
        <div className={styles.heading}>Fees</div>
        <div className={styles.heading}>Total Holdings</div>
      </div>
      {Object.entries(csvData).map(([key, value], index) => {
        const month = monthNames[key - 1] ? `${monthNames[key - 1]} 2023` : '0'
        const fee = monthlyFees[key] ? formatToDollar(monthlyFees[key]) : '0'
        const holding = value ? formatToDollar(value) : '0'
        const currentTokenData = tokenData && tokenData[index] ? tokenData[index] : '0'

        return <Row key={index} month={month} fee={fee} holding={holding} tokenData={currentTokenData} />
      })}
    </Card>
  )
}

export default MonthList
