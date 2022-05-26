import React,{ useState } from 'react'
import Link from 'next/link'
import Layout from '../../components/layouts/layout'
import Head from 'next/head'
import { H1 } from '../../components/header'
import { useQuery, gql, useReactiveVar } from '@apollo/client'
import FilterField from '../../components/shared/filters'
import ColField from '../../components/shared/cols'
import RowField from '../../components/shared/rows'
import { objectDifinitionsVar } from '../../apollo/objectDifinitions'
import Submit from '../../components/pages/reports/submit'

type Filter = {
  objectDifinitionId: int
  operator: string
  value: string
  connector: string
}

type Col = {
  objectDifinitionId: int
}

type Row = {
  objectDifinitionId: int
}

type Group = {
  objectDifinitionId: int
}

export const FilterConditions = React.createContext({} as {
  filters: [Filter]
  setFilters: React.Dispatch<React.SetStateAction<[Filter]>>
})

export const ColConditions = React.createContext({} as {
  cols: [Col]
  setCols: React.Dispatch<React.SetStateAction<[Col]>>
})

export const RowConditions = React.createContext({} as {
  Rows: [Row]
  setRows: React.Dispatch<React.SetStateAction<[Row]>>
})

export default function New(){

  const [filters, setFilters] = useState([])
  const [cols, setCols] = useState([])
  const [rows, setRows] = useState([])
  let filtersInput = [], 
    colsInput = [],
    rowsInput = [],
    ids = [],
    rowIds = [],
    colIds = []

  const GET_OBJECT = gql`
    query(
      $accountId: Int!,
      $number: String!, 
      $filters: [Filter], 
      $objectId: Int!, 
      $ids: [Int], 
      $colIds: [Group], 
      $rowIds: [Group]
    ){
      getObject(
        accountId: $accountId, 
        number: $number, 
        filters: $filters, 
        rowIds: $rowIds, 
        colIds: $colIds 
      ){
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

  filters.map((filter)=>{
    let f = {
      objectDifinitionId: filter.objectDifinitionId,
      operator: filter.operator,
      value: filter.value
    }

    filtersInput.push(f)
  })

  cols.map((col)=>{
    ids.push(col.objectDifinitionId)
  })

  cols.map((col)=>{
    let f = {
      objectDifinitionId: col.objectDifinitionId
    }
    colIds.push(f)
  })

  rows.map((row)=>{
    let f = {
      objectDifinitionId: row.objectDifinitionId
    }
    rowIds.push(f)
  })

  const variables = {
    accountId: 1,
    number: "00000001",
    filters: filtersInput,
    colIds: colIds,
    rowIds: rowIds,
    ids: ids,
    objectId: 1
  }

  let { data, loading, error } = useQuery(GET_OBJECT, {
    variables: variables
  })

  if(error){
    return (<div className="grid-1 grid-container">Failed to load</div>)
  }

  if(!data) return <div className="grid-1 grid-container">Loading...</div>
  const { getObject, getObjectDifinitions } = data

  objectDifinitionsVar(getObjectDifinitions)

  return(
    <Layout>
      <div>
        <H1 title="レポート/セグメント管理" />
      </div>

      <div>
        <h2>Filter</h2>
        <FilterConditions.Provider value={{filters, setFilters}}>
          <FilterField fields={getObjectDifinitions} />
        </FilterConditions.Provider>
        <ColConditions.Provider value={{cols, setCols}}>
          <ColField fields={getObjectDifinitions} />
        </ColConditions.Provider>
        <RowConditions.Provider value={{rows, setRows}}>
          <RowField fields={getObjectDifinitions} />
        </RowConditions.Provider>
        <Submit
          accountId="1" 
          number="00000001"
          accountUserId="1"
          title="title"
          filters={filters}
          rows={rows} 
          cols={cols} 
        />
      </div>

      <table>
        <thead>
          <tr>
            {getObjectDifinitions.map((difinition)=>{
              return(
                <th key={difinition.id}>{difinition.title}</th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {Object.entries(getObject.ecforce).map(([k,v])=>{
            return (
              <tr key={k}>
                {getObjectDifinitions.map((difinition)=>{
                  return (
                    <td key={difinition.id}>{v[difinition.name]}</td>
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
