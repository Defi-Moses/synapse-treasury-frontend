import { useState } from 'react'
import formatToDollar from '../utils/helpers'
import { FaChevronDown } from 'react-icons/fa'
import { tokenMapping } from '../utils/tokenMapping'
import ListCard from './library/ListCard'

const Row = ({ month, fee, holding, tokenData }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleClick = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <>
      <div onClick={handleClick} className='flex gap-[0.5rem] rounded-lg text-white'>
        <div className='flex-1 text-center'>{month}</div>
        <div className='flex-1 text-center'>{fee}</div>
        <div className='flex-1 text-center'>{holding}</div>
        <FaChevronDown className='pr-4' />
      </div>
      {isExpanded && (
        <div className='flex flex-col sm:flex-row rounded-lg' style={{ backgroundColor: '	#282828' }}>
          {[tokenData].map((tokenPart, index) => (
            <ListCard title1='Token' title2='Holdings' data={tokenPart} mapping={tokenMapping}></ListCard>
          ))}
        </div>
      )}
    </>
  )
}

export default Row
