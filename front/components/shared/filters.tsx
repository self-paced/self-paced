import React, { useContext } from 'react'
import { FilterConditions } from '../../pages/reports/new'
import { useForm, SubmitHandler } from "react-hook-form"
import { objectDifinitionsVar } from '../../apollo/objectDifinitions'
import { useQuery, gql, useReactiveVar } from '@apollo/client'

type Inputs = {
  condition: string
  value: string
  id: int
}

type Delete = {
  id: int
}

export default function FilterField(props){
  const { filters, setFilters } = useContext(FilterConditions)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useForm<Inputs>()

  // formのリアルタイム監視
  const Name      = watch("name")
  const Condition = watch("condition")
  const Value     = watch("value")
  let difinitions: any = useReactiveVar(objectDifinitionsVar)

  const onSubmit: SubmitHandler<Inputs> = (value) => {
    let name, title

    difinitions.map((difinition)=>{
      if(difinition.id == value.id){
        name = difinition.name
        title = difinition.title
      }
    })

    setFilters(
      [...filters, {
        oparator: value.oparator,
        value: value.value,
        objectDifinitionId: value.id,
        name: name,
        title: title
      }]
    )
  }

  function HandleDelete(value){
    setFilters(
      filters.filter((filter, index) => ( filter.objectDifinitionId != value))
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

  return(
    <div>
      <form onSubmit={handleSubmit(onSubmit)} acceptCharset="UTF-8">
      <select
        className={` ${errors.name && "is-invalid"}`}
        id="id"
        name="id"
        {...register("id", {
          required: true,
        })}
        >
        <option value="">選択してください</option>
        {getObjectDifinitions.map((field)=>{
          return(
            <option data-hoge={field.title} value={field.id}>{field.title}</option>
          )
        })}
      </select>

      <select
        className={` ${errors.condition && 'is-invalid'}`}
        id="oparator"
        name="oparator"
        {...register("oparator",{
          required: true
        })}
        >
        <option value="=">=</option>
        <option value=">=">&gt;=</option>
        <option value="<=">&lt;=</option>
        <option value="!=">!=</option>
      </select>

      <input
        className={` ${errors.value && 'is-invalid'}`}
        id="value"
        name="value"
        {...register("value",{
          required: true
        })}
        />

      <input
        className=""
        id="submit"
        type="submit"
        value="submit"
        />
    </form>
    <ul>
      {filters.map((filter)=>{
        return(
          <li>
            {filter.title} {filter.oparator} {filter.value}
            <button onClick={()=>HandleDelete(filter.objectDifinitionId)}>x</button>
          </li>
        )
      })}
    </ul>
    </div>
  )
}
