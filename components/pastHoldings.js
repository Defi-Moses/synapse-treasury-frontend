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
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // Months from 1 to 12
  const years = [2023, 2024]; // Include both 2023 and 2024
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

// Fetch treasury sums for both years, up to January 2024
Promise.all(
  years.flatMap((year) =>
    months.map((month) =>
      (year < 2024 || (year === 2024 && month < 4)) ?
        fetch(`/api/data?file=treasurySums_${month}_${year}.csv&type=summary`).then((response) => response.json()) :
        Promise.resolve(null) // Resolve to null for dates beyond January 2024
    )
  )
)
    .then((csvData) => {
      console.log('Fetched CSV data:', csvData);
      const monthlyTotals = csvData.reduce((acc, curr, index) => {
        if (!curr) return acc; // Skip if current is null
        const year = years[Math.floor(index / 12)]; // Determine the year based on index
        const month = months[index % 12]; // Determine the month based on index
        if (year < 2024 || (year === 2024 && month < 4)) {
          acc[`${month}/${year}`] = Object.values(curr).reduce((a, b) => a + b, 0);
        }
        return acc;
      }, {});
      console.log('Monthly totals:', monthlyTotals);
      setCsvData(monthlyTotals);
    })
    .catch((error) => {
      console.error('Error fetching CSV data:', error);
    });

// Fetch token data for both years, up to January 2024
Promise.all(
  years.flatMap((year) =>
    months.map((month) =>
      (year < 2024 || (year === 2024 && month < 4 )) ?
        fetch(`/api/data?file=treasuryHoldings_${month}_${year}.csv&type=breakdown`).then((response) => response.json()) :
        Promise.resolve([]) // Resolve to an empty array for dates beyond January 2024
    )
  )
)
    .then((monthlyData) => {
      console.log('Fetched monthly token data:', monthlyData);
      const sortedMonthlyData = monthlyData.map((data) => {
        if (!data) return []; // Skip if data is null
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
      const fee = monthlyFees[key] ? formatToDollar(monthlyFees[key]) : '0';
      const holding = value ? formatToDollar(value) : '0';
      const currentTokenData = tokenData && tokenData[index] ? tokenData[index] : '0';

      return <Row key={index} month={formattedMonth} fee={fee} holding={holding} tokenData={currentTokenData} />;
    })}
  </Card>
);
}

export default MonthList