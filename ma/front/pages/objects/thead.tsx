import Link from 'next/link'
import { useQuery, gql } from '@apollo/client'

export default function Thead() {

  const GET_DIFINITIONS = gql`
    query($accountId: Int!, $objectId: Int!){
      getObjectDifinitions(accountId: $accountId, objectId: $objectId){
        title
        name
        columnType
      }
    }
  `

  const variables = {
    accountId: 1,
    objectId: 1
  }

  let { data, loading, error } = useQuery(GET_DIFINITIONS, {
    variables: variables
  })

  if(error){
    return (<div className="grid-1 grid-container">Failed to load</div>)
  }

  if(!data) return <div className="grid-1 grid-container">Loading...</div>

  const { getObjectDifinitions } = data

  return (
    <thead>
      <tr>
        {getObjectDifinitions.map((difinition)=>{
          return(
            <th key={difinition.id}>{difinition.title}</th>
          )
        })}
      </tr>
    </thead>
  )
}
