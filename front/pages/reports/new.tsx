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

type Filters = {
  filter: [filter]
}

export default function New(){

  const GET_OBJECT = gql`
    query($accountId: Int!, $number: String!, $filters: Filter){
      getReportData(accountId: $accountId, number: $number, filters: $filters ){
        ecforce
      }
    }
  `

  const variables = {
    accountId: 1,
    number: "00000001",
    filters: [
      {
        objectDifinitionId: 1,
        oparator: "=",
        value: ""
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

  const { getObject } = data
  console.log(getObject)

  return(
    <Layout>
      <div>
        <H1 title="レポート/セグメント管理" />
      </div>

      <table>
        <tbody>
          {getObject.ecforce.data.shopOrders.map((order)=>{
            return(
              <tr key={order.orderItemId}>
                <td>{order.orderId}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Layout>
  )
}
