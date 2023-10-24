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
      const claimedFees = parseFloat(item['Claimed Fees'].replace(/[$,]/g, ''));
      const unclaimedFees = parseFloat(item['Unclaimed Fees'].replace(/[$,]/g, ''));
      const chain = item.Chain.charAt(0).toUpperCase() + item.Chain.slice(1);
      acc[chain] = claimedFees + unclaimedFees;
      return acc;
    }, {});
  } else if (type === 'breakdown') {
    data = results.data.reduce((acc, item) => {
      const value = parseFloat(item['Value'])
      if (!acc[item['Token Symbol']]) {
        acc[item['Token Symbol']] = 0;
      }
      acc[item['Token Symbol']] += value;
      return acc;
    }, {});
  }

  // Format the data to dollar value
  for (let key in data) {
    data[key] = `$${Math.round(data[key]).toLocaleString()}`;
  }

  res.status(200).json(data);
}