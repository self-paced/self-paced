import Link from 'next/link'
import Layout from '../../components/layouts/layout'
import Head from 'next/head'
import { H1 } from '../../components/header'
import Nav from '../../components/objects/nav'
import { useQuery, gql } from '@apollo/client';

type ObjectType = {
  id: Integer
  title: String
}

type Object = {
  id: Integer
  title: String
  number: String
  objectType: ObjectType
  recordCount: Int
  size: Int
  createdAt: String
  updatedAt: String
}

export default function Index(){

  const GET_DATA = gql`
    query ( $id: Int! ){
      getObjects(accountId: $id){
        number
        title


      }
    }`

  const variables = {
    id: 1
  }

  let { data, loading, error } = useQuery(GET_DATA,{
    variables: variables
  })
  
  if (error) {
    console.log(error)  
    return (<div className="grid-1 grid-container">Failed to load</div>)
  }
  if (!data) return <div className="grid-1 grid-container">Loading...</div>
  const { getObjects } = data

  console.log(getObjects)

  return (
    <Layout>
      <div>
        <H1 title="オプジェクト管理" />
      </div>
      <Nav />

      <table>
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>データ名</th>
            <th>連携元</th>
            <th>ステータス</th>
            <th>レコード数</th>
            <th>サイズ</th>
            <th>最新データ更新日時</th>
            <th>最終更新者</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {getObjects.map((object: Object)=>{
            return(
              <tr key={object.number}>
                <td>{object.number}</td>
                <td>{object.title}</td>
                <td>&nbsp;</td>
                <td>{object.recordCount}</td>
                <td>{object.size}</td>
                <td>{object.updatedAt}</td>
                <td></td>
                <td>
                  <Link href={`/objects/${object.number}`}>
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
