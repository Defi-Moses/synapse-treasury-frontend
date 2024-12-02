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
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Oct', 'Nov', 'Dec']
  const { loading, error, data } = useQuery(GET_HISTORICAL_FEES)
  
// Update the useEffect hook
useEffect(() => {
  console.log('useEffect triggered');
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [2023, 2024];
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  Promise.all(
    years.flatMap((year) =>
      months.map((month) =>
        (year < 2024 || (year === 2024 && month <= 12)) ?
          fetch(`/api/data?file=treasurySums_${month}_${year}.csv&type=summary`)
            .then((response) => response.json())
            .catch(() => null) : // Return null for missing data
          Promise.resolve(null)
      )
    )
  )
    .then((csvData) => {
      console.log('Fetched CSV data:', csvData);
      const monthlyTotals = csvData.reduce((acc, curr, index) => {
        const year = years[Math.floor(index / 12)];
        const month = months[index % 12];
        acc[`${month}/${year}`] = curr ? Object.values(curr).reduce((a, b) => a + b, 0) : null;
        return acc;
      }, {});
      console.log('Monthly totals:', monthlyTotals);
      setCsvData(monthlyTotals);
    })
    .catch((error) => {
      console.error('Error fetching CSV data:', error);
    });

  Promise.all(
    years.flatMap((year) =>
      months.map((month) =>
        (year < 2024 || (year === 2024 && month <= 12)) ?
          fetch(`/api/data?file=treasuryHoldings_${month}_${year}.csv&type=breakdown`)
            .then((response) => response.json())
            .catch(() => null) : // Return null for missing data
          Promise.resolve(null)
      )
    )
  )
    .then((monthlyData) => {
      console.log('Fetched monthly token data:', monthlyData);
      const sortedMonthlyData = monthlyData.map((data) => {
        if (!data) return null; // Return null for missing data
        const sortedData = Object.entries(data)
          .filter(([key]) => key !== 'SYN')
          .map(([key, value]) => {
            const normalizedKey = key.split(' ')[0];
            return [normalizedKey, value];
          })
          .sort((a, b) => b[1] - a[1])
          .slice(0, 15);
        return sortedData;
      });

      setTokenData(sortedMonthlyData);
    })
    .catch((error) => {
      console.error('Error fetching token data:', error);
    });

  if (data && data.dailyStatisticsByChain) {
    console.log('GraphQL data available:', data);
    const monthlyFees = data.dailyStatisticsByChain.reduce((acc, curr) => {
      const month = new Date(curr['date']).getMonth() + 1;
      const year = new Date(curr['date']).getFullYear();
      acc[`${month}/${year}`] = (acc[`${month}/${year}`] || 0) + curr.total;
      return acc;
    }, {});
    setMonthlyFees(monthlyFees);
  } else {
    console.log('No GraphQL data available');
  }
}, [data, loading, error]);

  if (!csvData || !data || !tokenData) {
    return (
      <Card className={styles.card}>
        <div className='flex h-full w-full items-center justify-center'>
          <Loader />
        </div>
      </Card>
    )
  }

// Update the return statement
return (
  <Card className={styles.card}>
    <Badge sticky>Historical Data</Badge>
    <div className={styles.headings}>
      <div className={styles.heading}>Date</div>
      <div className={styles.heading}>Fees</div>
      <div className={styles.heading}>Total Holdings</div>
    </div>
    {Object.entries(csvData).map(([key, value], index) => {
      const [month, year] = key.split('/');
      const formattedMonth = monthNames[parseInt(month) - 1] ? `${monthNames[parseInt(month) - 1]} ${year}` : '0';
      const fee = monthlyFees[key] ? formatToDollar(monthlyFees[key]) : '-';
      const holding = value !== null ? formatToDollar(value) : '-';
      const currentTokenData = tokenData && tokenData[index] ? tokenData[index] : null;

      return <Row key={index} month={formattedMonth} fee={fee} holding={holding} tokenData={currentTokenData} />;
    })}
  </Card>
);
}

export default MonthList