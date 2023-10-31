import styles from './Card.module.scss'

export default function Card({ children, className, variant }) {
  return (
    <div className={`${styles.container} ${className ? className : ''} ${variant === 'filled' ? styles.filled : ''}`}>
      {children}
    </div>
  )
}
