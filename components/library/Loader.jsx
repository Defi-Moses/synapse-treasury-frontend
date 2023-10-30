import styles from './Loader.module.scss'

export default function Loader() {
  return (
    <div class={styles.ellipsis}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  )
}
