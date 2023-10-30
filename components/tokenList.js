import { useEffect, useState } from 'react'
import formatToDollar from '../utils/helpers'
import { tokenMapping } from '../utils/tokenMapping'
import ListCard from '@/components/library/ListCard'

const TokenList = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/data?file=currentTreasuryHoldings.csv&type=breakdown')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error:', error))
  }, [])

  if (!data) {
    return <div>Loading...</div>
  }

  const sortedData = Object.entries(data)
    // Filtered for SYN due to nuances
    .filter(([key]) => key !== 'SYN')

  return <ListCard title1='Token' title2='Total Holdings' data={data} mapping={tokenMapping} />
}

export default TokenList
