// treasury-frontend/components/pastHoldings.js
import { use, useEffect, useState } from 'react';
import formatToDollar from '../utils/helpers'
import { gql, useQuery, useLazyQuery} from '@apollo/client'
import { GET_HISTORICAL_FEES } from '../graphql/queries/index'

const MonthList = () => {
  const [csvData, setCsvData] = useState(null);
  const [monthlyFees, setMonthlyFees] = useState({});
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const { loading, error, data } = useQuery(GET_HISTORICAL_FEES);
  
  useEffect(() => {
    const months = Array.from({length: 9}, (_, i) => i + 1); // Months from 1 to 9
  
    Promise.all(months.map(month => 
      fetch(`/api/data?file=treasurySums_${month}_2023.csv&type=summary`)
        .then(response => response.json())
    ))
    .then(csvData => {
      const monthlyTotals = csvData.reduce((acc, curr, index) => {
        // Sum up the values
        acc[months[index]] = Object.values(curr).reduce((a, b) => a + b, 0);
        return acc;
      }, {});
      setCsvData(monthlyTotals);
    })
    .catch(error => console.error('Error:', error));
    if(data){
      console.log(data.dailyStatisticsByChain[1]['date'])
    }
    if (data && data.dailyStatisticsByChain) {
      const monthlyFees = data.dailyStatisticsByChain.reduce((acc, curr) => {
        const month = new Date(curr['date']).getMonth() + 1
        acc[month] = (acc[month] || 0) + curr.total;
        return acc;
      }, {});
      setMonthlyFees(monthlyFees);
    }
  }, [data, loading, error]);

  if(!csvData || !data){
    return <div>Loading...</div>
  }

  return (
    
    <div className="flex mx-auto justify-center">
      <div className="flex-1 flex flex-col items-center">
        <p className="font-bold text-lg">Month</p>
        {Object.entries(csvData).map(([key, value], index) => (
          <p key={index} className="text-center">{`${monthNames[key-1]} 2023`}</p>
        ))}
      </div>
      <div className="flex-1 flex flex-col items-center">
        <p className="font-bold text-lg">Monthly Fees</p>
        {Object.entries(csvData).map(([key, value], index) => {
          const fee = monthlyFees[key];
          return (
            <p key={index} className="text-center">{`${formatToDollar(fee || 0)}`}</p>
          );
        })}
      </div>
      <div className="flex-1 flex flex-col items-center">
        <p className="font-bold text-lg">Treasury Holdings</p>
        {Object.entries(csvData).map(([key, value], index) => (
          <p key={index} className="text-center">{`${formatToDollar(value)}`}</p>
        ))}
      </div>
      
    </div>
  );
};

export default MonthList;