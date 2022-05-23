import Link from 'next/link'
import Layout from '../../components/layouts/layout'
import Head from 'next/head'
import { H1 } from '../../components/header'
import { useQuery, gql } from '@apollo/client'

type Filter = {
  objectDifinitionId: int
  oparator: string
  value: string
  connector: string
}

type Group = {
  objectDifinitionId: int
}

export default function New(){

  const GET_OBJECT = gql`
    query($accountId: Int!, $number: String!, $filters: [Filter], $groups: [Group]){
      getReportData(accountId: $accountId, number: $number, filters: $filters, groups: $groups ){
        ecforce
      }
    }
  `

  const variables = {
    accountId: 1,
    number: "00000001",
    filters: [
      {
        objectDifinitionId: 14,
        oparator: ">",
        value: "15000"
      }
    ]
  }

  let { data, loading, error } = useQuery(GET_OBJECT, {
    variables: variables
  })

  if(error){
    return (<div className="grid-1 grid-container">Failed to load</div>)
  }

  if(!data) return <div className="grid-1 grid-container">Loading...</div>

  const { getReportData } = data
  console.log(getReportData)

  return(
    <Layout>
      <div>
        <H1 title="レポート/セグメント管理" />
      </div>

      <table>
        <tbody>
          {Object.entries(getReportData.ecforce).map(([k,v])=>{
            return(
              <tr>
                <td>{v["orderItemId"]}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Layout>
  )
}
