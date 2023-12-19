import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Badge, Col, FormGroup, Row, Table } from 'reactstrap'
import PaginationServer from '../Pagination/PaginationServer'
import { getDriverJobs } from '../../reducers/driverSlice'
import Loader from '../ApiLoader/loader'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { getDiverJobColor, getDiverJobTitle } from '../../Helper/helper'

const Jobs = ({activeTab,driverId}) => {
  const dispatch = useDispatch()
  const [loader, setLoader] = useState(true)
  const [jobsList, setDriverList] = useState([])
  const [paginationData, setPaginationData] = useState({})
  const [filterData,setFilterData] = useState({
      startDate:'',
      endDate:''
  })
  const getJobsList = useSelector(state=>state.driverSlice.driverJob)
  const pageChange = (data) =>{
      setLoader(true)
      dispatch(getDriverJobs({ page:data,driverId:driverId },filterData))
  }
  const handelFilter = (type) => {
      if (type==='reset') {
          setFilterData({
              startDate:'',
              endDate:''
          })
          dispatch(getDriverJobs({ page:1,driverId:driverId },{}))
      }else{
          dispatch(getDriverJobs({ page:1,driverId:driverId },filterData))
      }
  }
  useEffect(()=>{
      if (activeTab) {
          setLoader(true)
          dispatch(getDriverJobs({ page:1,driverId:driverId },filterData))
      }
  },[activeTab])
  useEffect(()=>{
      if(getJobsList){
          let pagData={
              totalDocs: getJobsList.totalDocs,
              limit: getJobsList.limit,
              page: getJobsList.page,
              totalPages: getJobsList.totalPages,
              hasPrevPage: getJobsList.hasPrevPage,
              hasNextPage: getJobsList.hasNextPage,
              prevPage: getJobsList.prevPage,
              nextPage: getJobsList.nextPage
          }
          setPaginationData(pagData)
          setDriverList(getJobsList.docs)
          setLoader(false)
      }
  },[getJobsList])
  return (
    <div className='row'>
            <Col xl='12'>
                <h6>Filter</h6>
                    <Row>
                        <Col md='4'>
                            <FormGroup>
                                <label>Date From</label>
                                <DatePicker
                                    className='form-control'
                                    selected={ filterData.startDate!=''?new Date(filterData.startDate):null }
                                    maxDate={ filterData.endDate!=''? new Date(filterData.endDate):null }
                                    onChange={(date)=>{
                                        filterData.startDate = moment(date).format('YYYY-MM-DD')
                                        setFilterData({...filterData})
                                    }}
                                />
                            </FormGroup>
                        </Col>
                        <Col md='4'>
                            <FormGroup>
                                <label>Date To</label>
                                <DatePicker
                                    className='form-control'
                                    selected={ filterData.endDate!=''?new Date(filterData.endDate):null }
                                    minDate={ filterData.startDate!=''?new Date(filterData.startDate):null }
                                    onChange={(date)=>{
                                        filterData.endDate = moment(date).format('YYYY-MM-DD')
                                        setFilterData({...filterData})
                                    }}
                                />
                            </FormGroup>
                        </Col>
                        <Col md='4' className='mt-md-4 mt-0'>
                            <button 
                                type='button' 
                                className='btn btn-success'
                                onClick={()=>handelFilter('filter')}
                            >
                                Filter
                            </button>
                            <button 
                                type='button' 
                                className='btn btn-info'
                                onClick={()=>handelFilter('reset')}
                            >
                                Reset
                            </button>
                        </Col>
                    </Row>
            </Col>
            <Col xl='12'>
                <Table>
                    <thead>
                        <tr>
                            <td>#</td>
                            <td>Is First</td>
                            <td>Status</td>
                            <td>Store</td>
                            <td>Order Number</td>
                            <td>CreatedAt</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            loader?
                            <tr>
                                <td colSpan='6'>
                                    <Loader/>
                                </td>
                            </tr>
                            :
                                jobsList.length==0?
                                    <tr>
                                        <td colSpan='6'>
                                            No Data Found
                                        </td>
                                    </tr>
                                :
                                    jobsList.map((item,key)=>(
                                        <tr key={item._id}>
                                            <td> { paginationData.page + key } </td>
                                            <td> 
                                              <Badge 
                                                color={item.isFirst?'success':'danger'}
                                              >
                                                {item.isFirst?'True':'False'}
                                              </Badge> 
                                            </td>
                                            <td> 
                                              <Badge 
                                                color={getDiverJobColor(item.status)}
                                              >
                                                {getDiverJobTitle(item.status)}
                                              </Badge> 
                                            </td>
                                            <td> { item.storeDetail.name } </td>
                                            <td> { item.orderDetail.orderNumber } </td>
                                            <td> { moment(item.createdAt).format('MMMM Do YYYY, h:mm:ss a') } </td>
                                        </tr>
                                    ))
                        }  
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={6} className="text-right">
                            {
                                (paginationData)?
                                    <PaginationServer 
                                        data={paginationData}
                                        pagFun={pageChange}
                                    />
                                :null        
                            }
                            </td>
                        </tr>
                    </tfoot>
                </Table>
            </Col>
    </div>
  )
}

export default Jobs