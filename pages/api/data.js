// treasury-frontend/pages/api/data.js
import path from 'path';
import fs from 'fs';
import Papa from 'papaparse';

export default function handler(req, res) {
  const { file, type } = req.query;
  const csvFilePath = path.join(process.cwd(), `/public/data/${file}`);
  const csvData = fs.readFileSync(csvFilePath, 'utf8');
  const results = Papa.parse(csvData, { header: true });

  let data = {};

  if (type === 'summary') {
    data = results.data.reduce((acc, item) => {
      const claimedFees = typeof item['Claimed Fees'] === 'string' 
        ? parseFloat(item['Claimed Fees'].replace(/[$,]/g, ''))
        : 0;
    
      const unclaimedFees = typeof item['Unclaimed Fees'] === 'string' 
        ? parseFloat(item['Unclaimed Fees'].replace(/[$,]/g, ''))
        : 0;
      const swapUnclaimedFees = typeof item['Swap Unclaimed Fees'] === 'string' 
        ? parseFloat(item['Swap Unclaimed Fees'].replace(/[$,]/g, ''))
        : 0;
      const cctpUnclaimedFees = typeof item['CCTP Unclaimed Fees'] === 'string' 
        ? parseFloat(item['CCTP Unclaimed Fees'].replace(/[$,]/g, ''))
        : 0;
      const chain = item.Chain.charAt(0).toUpperCase() + item.Chain.slice(1);
      acc[chain] = claimedFees + unclaimedFees + swapUnclaimedFees + cctpUnclaimedFees;
      return acc;
    }, {});
  } else if (type === 'breakdown') {
    data = results.data.reduce((acc, item) => {
      const value = parseFloat(item['Value'])
      const tokenSymbol = item['Token Symbol'] ? item['Token Symbol'].toUpperCase() : '';
      if (!acc[tokenSymbol]) {
        acc[tokenSymbol] = 0;
      }
      acc[tokenSymbol] += value;
      return acc;
    }, {});
  }

  // Format the data to dollar value
  // for (let key in data) {
  //   data[key] = `$${Math.round(data[key]).toLocaleString()}`;
  // }

  res.status(200).json(data);
}