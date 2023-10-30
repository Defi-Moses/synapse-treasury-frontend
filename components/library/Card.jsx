import styles from './Card.module.scss'

export default function Card({ children, className }) {
  return <div className={`${styles.container} ${className ? className : ''}`}>{children}</div>
}
