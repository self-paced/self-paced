import Link from 'next/link'
import Layout from '../../components/layouts/layout'
import Head from 'next/head'
import { H1 } from '../../components/header'
import { useQuery, gql } from '@apollo/client'

export default function Reports(){

  return (
    <Layout>
      <div>
        <H1 title="レポート/セグメント管理" />
      </div>

      <Link href="/reports/new">
        <a>
          新規作成
        </a>
      </Link>
    </Layout>
  )
}
