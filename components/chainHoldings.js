import { useEffect, useState } from 'react'
import formatToDollar from '@/utils/helpers'
import { chainMapping } from '@/utils/tokenMapping'
import ListCard from '@/components/library/ListCard'

const ChainHoldings = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/data?file=sums.csv&type=summary')
      .then((response) => response.json())
      .then((data) => {
        const sortedData = Object.entries(data)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 15)
        setData(sortedData)
      })
      .catch((error) => console.error('Error:', error))
  }, [])


  return <ListCard label='Chain Holdings' data={data} mapping={chainMapping} />
}

export default ChainHoldings
