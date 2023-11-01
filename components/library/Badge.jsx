import styles from './Badge.module.scss'

import PropTypes from 'prop-types'

export default function Badge({ children, filled, sticky, rectangle, color, bottom }) {
  const badge = (
    <div className={`${styles.container} ${filled ? styles.filled : ''} ${rectangle ? styles.rectangle : ''}`}>
      {children}
    </div>
  )

  return sticky ? <div className={`${styles.sticky} ${bottom ? styles.bottom : ''}`}>{badge}</div> : badge
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
}
