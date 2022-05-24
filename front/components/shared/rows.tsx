import React, { useContext } from 'react'
import { RowConditions } from '../../pages/reports/new'
import { useForm, SubmitHandler } from 'react-hook-form'
import { objectDifinitionsVar } from '../../apollo/objectDifinitions'
import { useQuery, gql, useReactiveVar } from '@apollo/client'

type Inputs = {
  id: int
}

export default function RowField(props){

  const { rows, setRows } = useContext(RowConditions)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<Inputs>()

  const Name      = watch("name")
  let difinitions: any = useReactiveVar(objectDifinitionsVar)

  const onSubmit: SubmitHandler<Inputs> = (value) =>{
    let name, title

    difinitions.map((difinition)=>{
      if( difinition.id == value.id ){
        name = difinition.name
        title = difinition.title
      }
    })

    setRows(
      [...rows, {
        name: name,
        title: title,
        objectDifinitionId: value.id
      }]
    )
  }

  function HandleDelete(value){
    setRows(
      rows.filter((row, index) => (row.objectDifinitionId != value))
    )
  }


  const GET_OBJECT = gql`
    query($accountId: Int!, $objectId: Int!){
      getObjectDifinitions(accountId: $accountId, objectId: $objectId){
        id
        title
        name
        columnType
      }
    }
  `

  const variables = {
    accountId: 1,
    objectId: "00000001"
  }

  let { data, loading, error } = useQuery(GET_OBJECT, {
    variables: variables
  })

  if( error ){
    return (<div className="grid-1 grid-container">Failed to load</div>)
  }
  if(!data) return <div className="grid-1 grid-container">Loading...</div>
  const { getObjectDifinitions } = data

  return (
    <div>
      <h2>行</h2>
      <form onSubmit={handleSubmit(onSubmit)} acceptCharset="UTF-8">
        <select
          className={` ${errors.id} && "is-invalid}"`}
          name="id"
          {...register("id", {
            required: true
          })}
          >
          <option value="">選択してください</option>
          {getObjectDifinitions.map((field)=>{
            return(
              <option value={field.id}>{field.title}</option>
            )
          })}
        </select>
        <input
          type="submit"
          value="submit"
        />
      </form>
      <ul>
        {rows.map((row)=>{
          return(
            <li>
              {row.title}
              <button onClick={()=>HandleDelete(row.objectDifinitionId)}>x</button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
