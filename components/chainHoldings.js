import { useEffect, useState } from 'react'
import formatToDollar from '@/utils/helpers'
import { chainMapping } from '@/utils/tokenMapping'
import ListCard from '@/components/library/ListCard'

const ChainHoldings = () => {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('/api/data?file=sums.csv&type=summary')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error:', error))
  }, [])

  if (!data) {
    return <div>Loading...</div>
  }

  return <ListCard title1='Chain' title2='Total Holdings' data={data} mapping={chainMapping} />
}

export default ChainHoldings
