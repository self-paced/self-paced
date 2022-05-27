import Link from 'next/link'
import Layout from '../../../components/layouts/layout'
import Head from 'next/head'
import {H1} from '../../../components/header'
import { useQuery, gql } from '@apollo/client'
import { useRouter } from "next/router"
import client from '../../../apollo-client'

type Filter = {
  objectDifinitionId: int
  operator: string
  value: string
  connector: string
}

type Group = {
  objectDifinitionId: int
}

export const getServerSideProps = async(context) => {

  const GET_REPORT = gql`
    query getReport($accountId: Int!, $number: String!) {
      getReport(accountId: $accountId, number: $number){
        title
        description
        whereQueries {
          objectDifinitionId
          operator
          value
        }
        rowQueries {
          objectDifinitionId
        }
        colQueries {
          objectDifinitionId
        }
      }
    }
  `

  const variables = {
    accountId: 1,
    number: context.query.id
  }

  const { loading, error, data } = await client.query({
    query: GET_REPORT,
    variables: variables
  })

  if (error) return <div className="grid-1 grid-container">Failed to load</div>
  if (!data) return <div className="grid-1 grid-container">Loading...</div>

  const  { getReport } = data

  return {
    props: {
      getReport
    },
  }
}

export default function Index({getReport}){

  const router = useRouter()
  console.log(getReport)

  const GET_REPORT = gql`
    query(
      $accountId: Int!,
      $number: String!,
      $filters: [Filter],
      $colIds: [Group],
      $rowIds: [Group]
    ){
      getObject(accountId: $accountId, number: $number){
        ecforce
      }
      getObjectDifinitions(accountId: $accountId, number: $number){
        id
        title
        name
        columnType
      }
    }
  `

  const variables = {
    accountId: 1,
    number: router.query.id
  }

  let { data, loading, error } = useQuery(GET_REPORT, {
    variables: variables
  })

  if(error){
    return (<div className="grid-1 grid-container">Failed to load</div>)
  }
  if(!data) return <div className="">Loading...</div>

  const { getObject, getObjectDifinitions } = data

  return (
    <Layout>
      <div>
        <H1 title="レポート/セグメント管理" />
      </div>
      <div>
        <h2>hey</h2>
      </div>
    </Layout>
  )
}
