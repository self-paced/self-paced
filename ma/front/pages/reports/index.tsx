import Link from 'next/link'
import Layout from '../../components/layouts/layout'
import Head from 'next/head'
import { H1 } from '../../components/header'
import { useQuery, gql } from '@apollo/client'
import { useForm, SubmitHandler } from 'react-hook-form'

type Inputs = {
  keyword: string
}

export default function Reports(){

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<Inputs>()

  const keyword = watch('keyword')

  const GET_REPORTS = gql`
    query($accountId: Int!, $keyword: String){
      getReports(accountId: $accountId, keyword: $keyword){
        id
        title
        number
        description
        createdAt
        updatedAt
        accountUser {
          name
        }
      }
    }
  `

  const variables = {
    accountId: 1,
    keyword: keyword
  }

  let {data, loading, error} = useQuery(GET_REPORTS, {
    variables: variables
  })

  if(error){
    console.log(error)
    return (<div className="grid-1 grid-container">Failed to load</div>)
  }

  if(!data) return <div className="grid-1 grid-container">Loading...</div>

  const { getReports } = data

  console.log(getReports)
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
      <br />
      <label>
        検索
        </label>
      <input 
        type="text"
        {...register("keyword", {
          
        })}
        name="keyword"
      />

      <table>
        <thead>
          <tr>
            <th>レポート名</th>
            <th>説明</th>
            <th>フォルダ</th>
            <th>作成者</th>
            <th>作成日</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {getReports.map((report)=>{
            return (
              <tr key={report.id}>
                <td>{report.title}</td>
                <td>{report.description}</td>
                <td>&nbsp;</td>
                <td>{report.accountUser.name}</td>
                <td>{report.createdAt}</td>
                <td>
                  <Link href={`/reports/${report.number}`}>
                    <a>
                      詳細
                    </a>
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Layout>
  )
}
