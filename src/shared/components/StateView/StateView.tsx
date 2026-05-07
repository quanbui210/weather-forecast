import type { ReactNode } from 'react'
import styles from './StateView.module.scss'

type StateViewProps = {
  eyebrow?: string
  title: string
  message?: string
  action?: ReactNode
}

export function StateView({ eyebrow, title, message, action }: StateViewProps) {
  return (
    <section className={styles.state}>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h2 className={styles.title}>{title}</h2>
      {message ? <p className={styles.message}>{message}</p> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </section>
  )
}
