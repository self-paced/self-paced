import Link from 'next/link'
import styles from '../../styles/layouts/Sidenav.module.scss'
import { useQuery, gql } from '@apollo/client'

export default function SideNav(){

  return(
    <div className={styles.side_nav}>
      <div>
        <ul>
          <li>
            <Link href="/objects/">
              <a>オプジェクト管理</a>
            </Link>
          </li>
          <li>
            <Link href="#">
              <a>CSVアップロード</a>
            </Link>
          </li>
          <li>
            <Link href="#">
              <a>他システム連携</a>
            </Link>
          </li>
          <li>
            <Link href="#">
              <a>SQL実行</a>
            </Link>
          </li>
        </ul>
      </div>
       <div>
        <ul>
          <li>
            <Link href="/reports">
              <a>レポート/セグメント管理</a>
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <ul>
          <li>
            <Link href="#">
              <a>ダッシュボード</a>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
