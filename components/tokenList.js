import { useEffect, useState } from 'react';

const TokenList = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data?file=currentTreasuryHoldings.csv&type=breakdown')
      .then(response => response.json())
      .then(data => {
        const formattedData = Object.entries(data).reduce((acc, [key, value]) => {
          // Remove $ and commas, convert to number
          acc[key] = parseFloat(value.replace(/[$,]/g, ''));
          return acc;
        }, {});
        setData(formattedData);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  const sortedData = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 14);

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
      <p key={index}>{`$${Math.round(value).toLocaleString()}`}</p>
    ))}
  </div>
</div>
  );
};

export default TokenList;