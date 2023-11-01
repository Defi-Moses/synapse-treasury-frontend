import Card from '@/components/library/Card'
import styles from './ListCard.module.scss'
import formatToDollar from '@/utils/helpers'
import Loader from './Loader'
import Badge from './Badge'

export default function ListCard({ label, data, mapping, variant }) {
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
        <div className='flex justify-center w-full'>
          <Badge sticky>{label}</Badge>
        </div>

        <div className={styles.list}>
          <div className={styles.inner}>
            {data.map(([key, value], index) => (
              <div key={index} className='flex py-2 px-4 mb-1'>
                <div className={styles.left}>
                  <img src={mapping[key]} alt='' style={{ width: '22px', height: '22px' }} className='mr-2 ' />
                  {key}
                </div>
                <div className={styles.right}>{formatToDollar(value)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
