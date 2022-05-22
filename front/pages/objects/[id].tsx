import Link from 'next/link'
import Layout from '../../components/layouts/layout'
import Head from 'next/head'
import { H1 } from '../../components/header'
import Nav from '../../components/objects/nav'
import { useQuery, gql } from '@apollo/client'

export default function Show(){

  const GET_OBJECT = gql`
    query($accountId: Int!, $number: String!){
      getObject(accountId: $accountId, number: $number){
        ecforce
      }
    }
  `

  const variables = {
    accountId: 1,
    number: "00000001"
  }

  let { data, loading, error } = useQuery(GET_OBJECT, {
    variables: variables
  })

  if(error){
    console.log(error)
    return (<div className="grid-1 grid-container">Failed to load</div>)
  }

  if(!data) return <div className="grid-1 grid-container">Loading...</div>

  const { getObject } = data

  console.log(getObject)
  return (
    <Layout>
      <div>
        <H1 title="オブジェクト管理" />
      </div>
      <Nav />

      <table>
        <tbody>
          {getObject.ecforce.data.shopOrders.map((order) => {

            return(
              <tr>
                <td>{order.orderId}</td>
                <td>{order.orderItemId}</td>
                <td>{order.sourceId}</td>
                <td>{order.quantity}</td>
              </tr>
            )
          })}
          </tbody>
      </table>

      <p>hey</p>
    </Layout>
  )
}
