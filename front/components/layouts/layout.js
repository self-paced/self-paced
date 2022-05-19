import SideNav from '../shared/sidenav'
import styles from '../../styles/layouts/Wrapper.module.scss'
import HeaderNav from '../shared/header_nav'

export default function Layout({ children, top, InitialHeaderColor }) {
  return (
    <div className={styles.wrapper}>
      <SideNav />
      <div className={styles.main_content}>
        <HeaderNav />
        <main>{children}</main>
      </div>
    </div>
  )
}
