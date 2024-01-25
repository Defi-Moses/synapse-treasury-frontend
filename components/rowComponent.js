import { useState } from 'react'
import formatToDollar from '../utils/helpers'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { tokenMapping } from '../utils/tokenMapping'
import styles from './rowComponent.module.scss'
import Card from './library/Card'

const Row = ({ month, fee, holding, tokenData }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleClick = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <>
      <div onClick={handleClick} className={styles.row}>
        <div className={`${styles.item} ${styles.smaller}`}>{month}</div>
        <div className={`${styles.item} ${styles.smaller}`}>{fee}</div>
        <div className={styles.item}>{holding}</div>
        {!isExpanded ? <FaChevronDown className='pr-4' /> : <FaChevronUp className='pr-4' />}
      </div>
      {isExpanded &&
        [tokenData].map((tokenPart, index) => (
          <Card key={index} className={styles.card}>
            {tokenPart.slice(0, 5).map((token, i) => (
              <div key={i} className={styles.leftContainer}>
                <div className={styles.left}>
                  <img
                    src={tokenMapping[token[0]]}
                    alt={''}
                    style={{ width: '22px', height: '22px' }}
                    className='mr-2 ml-2'
                  />
                  <span>{token[0]}</span>
                </div>
                <div className='text-center'> {formatToDollar(token[1])}</div>
              </div>
            ))}
          </Card>
        ))}
    </>
  )
}

export default Row
