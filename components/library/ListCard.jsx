import Card from '@/components/library/Card'
import styles from './ListCard.module.scss'
import formatToDollar from '@/utils/helpers'
import Loader from './Loader'

export default function ListCard({ title1, title2, data, mapping, variant }) {
  if (!data?.length) {
    return (
      <Card variant={variant} className={styles.placeholder}>
        <div className='flex h-full w-full items-center justify-center'>
          <Loader />
        </div>
      </Card>
    )
  }

  return (
    <Card variant={variant} className={styles.placeholder}>
      <div className='flex flex-col w-2/3 mx-auto  font-inter text-white w-full'>
        <div className={styles.headings}>
          <div className={styles.title}>{title1}</div>
          <div className={`${styles.title} ${styles.right}`}>{title2}</div>
        </div>
        <div className={styles.list}>
          {data.map(([key, value], index) => (
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
