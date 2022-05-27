import Link from 'next/link'
import styles from '../../styles/layouts/Header.module.scss'

export default function HeaderNav(){

  return(
    <div className={styles.header_nav}>
      <div className={styles.header_nav__inner}>
        <ul>
          <li>
            <Link href="#">
              <a>よく使う検索</a>
            </Link>
          </li>
          <li>
            <Link href="#">
              <a>お知らせ</a>
            </Link>
          </li>
          <li>
            <Link href="#">
              <a>サポートガイド</a>
            </Link>
          </li>
        </ul>
      </div>
       <div>
        <ul>
          <li>
            <Link href="#">
              <a>PRODUCT</a>
            </Link>
          </li>
          <li>
            <Link href="#">
              <a>name</a>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
