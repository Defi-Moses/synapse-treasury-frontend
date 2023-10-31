import Card from '@/components/library/Card'
import styles from './ListCard.module.scss'
import formatToDollar from '@/utils/helpers'

export default function ListCard({ title1, title2, data, mapping }) {
  const sortedData = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15) // Slice size can be a prop if different sizes needed

  return (
    <Card>
      <div className='flex flex-col mb-8 w-2/3 mx-auto pb-8 font-inter text-white w-full'>
        <div className={styles.headings}>
          <div className={styles.title}>{title1}</div>
          <div className={`${styles.title} ${styles.right}`}>{title2}</div>
        </div>
        <div className={styles.list}>
          {sortedData.map(([key, value], index) => (
            <div key={index} className={`flex py-2 px-4 mb-1 ${index % 2 === 0 ? 'bg-gray-200' : 'bg-gray-600'}`}>
              <div className={styles.left}>
                <img src={mapping[key]} alt='' style={{ width: '22px', height: '22px' }} className='mr-2 ' />
                {key}
              </div>
              <div className={styles.right}>{formatToDollar(value)}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
