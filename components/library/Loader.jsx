import styles from './Loader.module.scss'

export default function Loader() {
  return (
    <div className={styles.ellipsis}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}
