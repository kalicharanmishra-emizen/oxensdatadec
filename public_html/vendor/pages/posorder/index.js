import React, { useEffect, useState } from 'react'
import moment from 'moment';
import Link from 'next/link';
import Vendor from 'layouts/Vendor'
import Loader from "components/ApiLoader/loader";
import UserHeader from 'components/Headers/UserHeader';
import { useDispatch, useSelector } from "react-redux";
import { getCompletedorders } from '../../reducers/storeSlice';
import PaginationServer from 'components/Pagination/PaginationServer';
import { getPaymentStatusColor, getPaymentStatusText, paymentModeColor, paymentModeText } from '../../Helper/helper';
import { Badge, Card, CardBody, CardFooter, CardHeader, Col, Container, Row, Table } from "reactstrap";

const index = () => {

  const dispatch = useDispatch()
  const [loader, setLoader] = useState(true)
  const [currentItem, setCurrentItem] = useState([])
  const [paginationData, setPaginationData] = useState(null)
  const list = useSelector(state=>state.storeSlice.list)
  const [currentOffset, setCurrentOffset] = useState(1)

  const pageChange=(data)=>{
    setLoader(true)
    dispatch(getCompletedorders(data))
  }

  useEffect(() => {
      dispatch(getCompletedorders(1))
  }, [])

  useEffect(()=>{
    if (!list.isLoading) {
        setCurrentItem(list.data.docs)
        setPaginationData({
            totalDocs: list.data.totalDocs,
            limit: list.data.limit,
            page: list.data.page,
            totalPages: list.data.totalPages,
            hasPrevPage: list.data.hasPrevPage,
            hasNextPage: list.data.hasNextPage,
            prevPage: list.data.prevPage,
            nextPage: list.data.nextPage
        })
        setLoader(false)
    }
  },[list])

console.log("list",list);
  return (
    <>
        <UserHeader/>
        <Container className="mt--7" fluid>
          <Row>
            <Col className="order-xl-1" xl='12'>
              <Card className="bg-secondary shadow">
                  <CardHeader className="bg-white border-0">
                      <Row className="align-items-center">
                      <Col xs="8">
                          <h3 className="mb-0">Order's</h3>
                      </Col>
                      </Row>
                  </CardHeader>
                  <CardBody>
                  <Table className="align-items-center table-flush" responsive>
                      <thead className="thead-light">
                      <tr>
                          <th scope="col">Sr/No</th>
                          <th scope="col">Order Number</th>
                          <th scope="col">User Name</th>
                          <th scope="col">Total Quantity</th>
                          <th scope="col">MRP</th>
                          <th scope="col">Discount Price</th>
                          <th scope="col">Payment Mode</th>
                          <th scope="col">Date</th>
                          <th scope="col">Invoice PDF</th>
                          <th scope="col"></th>
                      </tr>
                      </thead>
                      <tbody>
                          {
                              loader
                                ? <tr>
                                    <td colSpan="9">
                                      <Loader/>
                                    </td>
                                  </tr>  
                                : (currentItem.length>0)
                                    ? currentItem.map((data,index)=>(
                                        <tr key={data._id}>
                                          <td>{index + 1}</td>
                                          <td>{data.orderNumber}</td>
                                          <td>{data.userData.name}</td>
                                          <td>{data.totalQuantity}</td>
                                          <td>£{data.totalMrp}</td>
                                          <td>{data.discountPrice}</td>
                                          <td>
                                              <Badge 
                                                  role="button" 
                                                  id={data._id} 
                                                  color={paymentModeColor(data.paymentMode)}
                                              >
                                                  {paymentModeText(data.paymentMode)}
                                              </Badge>
                                          </td>
                                          <td>{moment(data.createdAt).format('YYYY-MM-D')}</td>
                                          <td>
                                              <Row style={{
                                                      display: 'flex',
                                                      alignItems: 'center',
                                                      justifyContent: 'center',
                                                  }}
                                              >
                                              {
                                                  data.venderPDF !== null 
                                                    ? <Link href={data?.venderPDF ?? ""} >
                                                        <a target="_blank" rel="noopener noreferrer" style={{color:"#525f7f"}}>
                                                          <span
                                                            role="button"
                                                            className="ni ni-cloud-download-95"
                                                            title="view PDF"
                                                          />
                                                          </a>
                                                      </Link> 
                                                    : ""
                                              }
                                              </Row>
                                          </td>
                                          <td>
                                              <Link href={`/posorder/detail/${data._id}`}>
                                                  <span
                                                      role="button"
                                                      className="ni ni-bold-right"
                                                      title="Detail"
                                                  />
                                              </Link>
                                          </td>
                                        </tr>
                                      ))
                                    : <tr>
                                        <td colSpan="9">no data found</td>
                                      </tr>
                          }
                      </tbody>
                  </Table>
                  </CardBody>
                  <CardFooter className="py-4">
                      <nav aria-label="...">
                          {
                              ( paginationData ) 
                                ? <PaginationServer 
                                    data={paginationData}
                                    pagFun={pageChange}
                                  />
                                : null        
                          }
                      </nav>
                  </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
    </>
  )
}

index.layout = Vendor
export default index