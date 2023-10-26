import { useEffect, useState } from 'react';
import formatToDollar from '../utils/helpers';

const TokenList = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data?file=currentTreasuryHoldings.csv&type=breakdown')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error:', error));
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  const sortedData = Object.entries(data)
  // Filtered for SYN due to nuances
    .filter(([key]) => key !== 'SYN')
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  return (
<div className="flex mb-8 w-2/3 mx-auto pb-8 mx-2">
  <div className="flex-1 flex flex-col">
    <h2 className="font-bold text-lg mb-2">Token Symbol</h2>
    {sortedData.map(([key, value], index) => (
      <p key={index}>{`${key.substring(0, 7)}`}</p>
    ))}
  </div>
  <div className="flex-1 flex flex-col ml-2">
    <h2 className="font-bold text-lg mb-2">Total Holdings</h2>
    {sortedData.map(([key, value], index) => (
      <p key={index}>{`${formatToDollar(value)}`}</p>
    ))}
  </div>
</div>
  );
};

export default TokenList;