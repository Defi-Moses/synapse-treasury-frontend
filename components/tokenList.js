import { useEffect, useState } from 'react'
import formatToDollar from '../utils/helpers'
import { tokenMapping } from '../utils/tokenMapping'
import ListCard from '@/components/library/ListCard'

const TokenList = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/data?file=currentTreasuryHoldings.csv&type=breakdown')
      .then((response) => response.json())
      .then((data) => {
        const sortedData = Object.entries(data)
          .filter(([key]) => key !== 'SYN')
          .map(([key, value]) => {
            const normalizedKey = key.split(' ')[0]
            return [normalizedKey, value]
          })
          .sort((a, b) => b[1] - a[1])
          .slice(0, 15)
        setData(sortedData)
      })
      .catch((error) => console.error('Error:', error))
  }, [])

  return <ListCard title1='Token' title2='Holdings' data={data} mapping={tokenMapping} />
}

export default TokenList
