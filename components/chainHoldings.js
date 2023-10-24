import { useEffect, useState } from 'react';

const ChainHoldings = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data?file=sums.csv&type=summary')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error:', error));
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col mb-8 w-2/3 mx-auto pb-8 font-inter">
      <div className="flex py-2 px-4 mb-1 bg-gray-100">
        <div className="flex-1 font-bold text-xl font-extrabold">Chain</div>
        <div className="flex-1 font-bold text-xl font-extrabold">Total Holdings</div>
      </div>
      {Object.entries(data).map(([key, value], index) => (
        <div 
          key={index} 
          className={`flex py-2 px-4 mb-1 ${index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-600'}`}
        >
          <div className="flex-1">{key}</div>
          <div className="flex-1">{value}</div>
        </div>
      ))}
    </div>
  );
};

export default ChainHoldings;