import Link from 'next/link'
import Layout from '../../components/layouts/layout'
import Head from 'next/head'
import { H1 } from '../../components/header'
import Nav from '../../components/objects/nav'
import { useQuery, gql } from '@apollo/client'
import Thead from './thead'

export default function Show(){

  const GET_OBJECT = gql`
    query($accountId: Int!, $number: String!, $objectId: Int!, $ids: [Int]){
      getObject(accountId: $accountId, number: $number){
        ecforce
      }

      getObjectDifinitions(accountId: $accountId, objectId: $objectId, ids: $ids){
        id
        title
        name
        columnType
      }
    }
  `

  const variables = {
    accountId: 1,
    number: "00000001",
    ids: [],
    objectId: 1
  }

  let { data, loading, error } = useQuery(GET_OBJECT, {
    variables: variables
  })

  if(error){
    console.log(error)
    return (<div className="grid-1 grid-container">Failed to load</div>)
  }

  if(!data) return <div className="grid-1 grid-container">Loading...</div>

  const { getObject, getObjectDifinitions } = data

  console.log(getObject)
  return (
    <Layout>
      <div>
        <H1 title="オブジェクト管理" />
      </div>
      <Nav />

      <table>
        <thead>
          <tr>
            {getObjectDifinitions.map((difinition)=>{
              return (
                <th key={difinition.id}>{difinition.title}</th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {Object.entries(getObject.ecforce).map(([k,v]) => {
            return(
              <tr key={k}>
                {getObjectDifinitions.map((difinition)=>{
                  return(
                    <td>{v[difinition.name]}</td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </Layout>
  )
}
