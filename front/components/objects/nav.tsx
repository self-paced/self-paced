import Link from 'next/link'
import { useQuery, gql } from '@apollo/client'

export default function Nav(){

  const GET_TYPE = gql`
    query( $id: Int!, $accountId: Int!){
      getObjectTypes( accountId: $accountId, id: $id ){
        id
        name
      }
    }
  `

  const variables = {
    id: 1,
    accountId: 1
  }

  let { data, loading, error } = useQuery(GET_TYPE, {
    variables: variables
  })

  if( error ){
    console.log(error)
    return (<div className="grid-1 grid-container">Failed to load</div>)
  }

  if( !data ){
    return (
      <div className="grid-1 grid-container">Loading...</div>
    )
  }
  const { getObjectTypes } = data
  console.log(data)

  return (
    <ul>
      <li>
        <Link href="/objects">
          <a>
            全て 
          </a>
        </Link>
      </li>
      {getObjectTypes.map((object: Object) => {
        return(
          <li key={object.id}>
            <Link href={`/objects`}>
              <a>
                {object.name}
              </a>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
