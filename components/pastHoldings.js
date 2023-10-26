// treasury-frontend/components/pastHoldings.js
import { useEffect, useState } from 'react';
import formatToDollar from '../utils/helpers'

const MonthList = () => {
  const [data, setData] = useState(null);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  useEffect(() => {
    const months = Array.from({length: 9}, (_, i) => i + 1); // Months from 1 to 9
    
    Promise.all(months.map(month => 
      fetch(`/api/data?file=treasurySums_${month}_2023.csv&type=summary`)
        .then(response => response.json())
    ))
    .then(data => {
      const monthlyTotals = data.reduce((acc, curr, index) => {
        // Sum up the values
        acc[months[index]] = Object.values(curr).reduce((a, b) => a + b, 0);
        return acc;
      }, {});
      setData(monthlyTotals);
    })
    .catch(error => console.error('Error:', error));
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex mx-auto justify-center">
      <div className="flex-1 flex flex-col items-center">
        <p className="font-bold text-lg">Month</p>
        {Object.entries(data).map(([key, value], index) => (
          <p key={index} className="text-center">{`${monthNames[key-1]} 2023`}</p>
        ))}
      </div>
      <div className="flex-1 flex flex-col items-center">
        <p className="font-bold text-lg">Total Amount</p>
        {Object.entries(data).map(([key, value], index) => (
          <p key={index} className="text-center">{`${formatToDollar(value)}`}</p>
        ))}
      </div>
    </div>
  );
};

export default MonthList;