import { useEffect, useState } from 'react'
import formatToDollar from '@/utils/helpers'
import { chainMapping } from '@/utils/tokenMapping'
import styles from './chainHolding.module.scss'
import Card from '@/components/library/Card'

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

  return (
    <Card>
      <div className='flex flex-col mb-8 w-2/3 mx-auto pb-8 font-inter text-white w-full'>
        <div className={styles.title}>
          <div className='flex-1 font-bold text-xl font-extrabold'>Chain</div>
          <div className='flex-1 font-bold text-xl font-extrabold'>Total Holdings</div>
        </div>
        <div className={styles.list}>
          {Object.entries(data)
            .sort((a, b) => b[1] - a[1])
            .map(([key, value], index) => (
              <div key={index} className={`flex py-2 px-4 mb-1 ${index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-600'}`}>
                <div className={styles.chain}>
                  <img src={chainMapping[key]} alt='' style={{ width: '22px', height: '22px' }} className='mr-2 ' />
                  {key}
                </div>
                <div className={styles.holdings}>{formatToDollar(value)}</div>
              </div>
            ))}
        </div>
      </div>
    </Card>
  )
}

export default ChainHoldings
