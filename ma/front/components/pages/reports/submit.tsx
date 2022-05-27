import { useMutation, gql } from '@apollo/client'
import { useForm, SubmitHandler } from 'react-hook-form'

type Filter = {
  objectDifinitionId: int
  operator: string
  value: string
  connector: string
}

type Group = {
  objectDifinitionId: int
}

export default function Submit(props) {
  console.log(props)

  let cols = [],
    rows   = [],
    filters = []

  props.cols.map((col)=>{
    let f = {
      objectDifinitionId: col.objectDifinitionId
    }
    cols.push(f)
  })

  props.rows.map((row)=>{
    let f = {
      objectDifinitionId: row.objectDifinitionId
    }
    rows.push(f)
  })

  props.filters.map((filter)=>{
    let f = {
      objectDifinitionId: filter.objectDifinitionId,
      operator: filter.operator,
      value: filter.value
    }
    filters.push(f)
  })

  const {
    handleSubmit
  } = useForm()

  const NEW_REPORT = gql`
    mutation createReport(
      $accountId: Int!,
      $accountUserId: Int!,
      $number: String!,
      $title: String!,
      $filters: [Filter],
      $colIds: [Group],
      $rowIds: [Group]
    ){
      createReport(
        accountId: $accountId,
        accountUserId: $accountUserId,
        number: $number,
        title: $title,
        filters: $filters,
        colIds: $colIds,
        rowIds: $rowIds
      ){
        title
        number
      }
    }
  `

  let [newReport, { data, loading, error }] = useMutation(NEW_REPORT)

  const onSubmit: SubmitHandler = (value) =>{
    console.log('here')
    console.log(filters)
    console.log(cols)
    console.log(rows)
    newReport({
      variables: {
        accountId: 1,
        accountUserId: 1,
        description: "test",
        number: "00000001",
        title: "test",
        filters: filters,
        colIds: cols,
        rowIds: rows
      },
    })

    if (loading ) return <div className="grid-1 grid-container">Loading...</div>
    if (error) {
      console.log("mutaion error: ", error.message)
    }
    console.log("success: ", data )
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} acceptCharset="UTF-8">
        <button>submit</button>
      </form>
    </div>
  )
}
