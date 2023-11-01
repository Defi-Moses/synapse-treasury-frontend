import { useState } from 'react'
import formatToDollar from '../utils/helpers'
import { FaChevronDown } from 'react-icons/fa'
import { tokenMapping } from '../utils/tokenMapping'
import styles from './rowComponent.module.scss'

const Row = ({ month, fee, holding, tokenData }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const firstThird = tokenData.slice(0, Math.ceil(tokenData.length / 3))
  const secondThird = tokenData.slice(Math.ceil(tokenData.length / 3), Math.ceil((tokenData.length / 3) * 2))
  const lastThird = tokenData.slice(Math.ceil((tokenData.length / 3) * 2))

  const handleClick = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <>
      <div onClick={handleClick} className={styles.row}>
        <div className={`${styles.item} ${styles.smaller}`}>{month}</div>
        <div className={`${styles.item} ${styles.smaller}`}>{fee}</div>
        <div className={styles.item}>{holding}</div>
        <FaChevronDown className='pr-4' />
      </div>
      {isExpanded && (
        <div className='flex justify-between rounded-lg' style={{ backgroundColor: '	#282828' }}>
          {/* <div className="flex justify-between" style={{ backgroundColor: 'gray' }}> */}
          {[firstThird, secondThird, lastThird].map((tokenPart, index) => (
            // <div key={index} className="flex-1 py-4">
            //   {tokenPart.map((token, i) => (
            //     <div key={i} className="text-center">{`${token[0]}: ${formatToDollar(token[1])}`}</div>
            //   ))}
            // </div>
            <div key={index} className='flex-1 py-4'>
              {tokenPart.map((token, i) => (
                <div key={i} className='flex'>
                  <img
                    src={tokenMapping[token[0]]}
                    alt={''}
                    style={{ width: '22px', height: '22px' }}
                    className='mr-2 ml-2'
                  />
                  <div className='text-center'>{`${token[0]}: ${formatToDollar(token[1])}`}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default Row
