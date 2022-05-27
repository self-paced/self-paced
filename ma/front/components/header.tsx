import styles from '../styles/components/Header.module.scss'

export const H1 = ({title}) => {
  return(
    <h1 className={styles.header1}>{title}</h1>
  )
}
