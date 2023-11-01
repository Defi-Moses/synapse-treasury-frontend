import styles from './Badge.module.scss'
export default function Badge({ children }) {
  return <div className={styles.container}>{children}</div>
}
