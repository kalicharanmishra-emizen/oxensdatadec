import moment from 'moment';
import Link from 'next/link';
import Vendor from 'layouts/Vendor'
import { useEffect, useState } from "react";
import Loader from "components/ApiLoader/loader";
import UserHeader from 'components/Headers/UserHeader';
import { useDispatch, useSelector } from "react-redux";
import PaginationServer from 'components/Pagination/PaginationServer';
import { Badge, Card, CardBody, CardFooter, CardHeader, Col, Container, Row, Table } from "reactstrap";
import { getStoreReviews } from '../../reducers/reviewStore';
function Index() {
    const dispatch = useDispatch()
    const [loader, setLoader] = useState(true)
    const [currentItem, setCurrentItem] = useState([])
    const [paginationData, setPaginationData] = useState(null)
    const list = useSelector(state=>state.reviewSlice.list)
    const [currentOffset, setCurrentOffset] = useState(1)
    useEffect(() => {
        dispatch(getStoreReviews(1))
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
    const pageChange=(data)=>{
        setLoader(true)
        dispatch(getStoreReviews(data))
    }
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
                                <h3 className="mb-0">Store Reviews</h3>
                            </Col>
                            </Row>
                        </CardHeader>
                        <CardBody>
                        <Table className="align-items-center table-flush" responsive>
                            <thead className="thead-light">
                            <tr>
                                <th scope="col">S/NO</th>
                                <th scope="col">User Detail</th>
                                <th scope="col">Order No.</th>
                                <th scope="col">Review Detail</th>
                            </tr>
                            </thead>
                            <tbody>
                                {
                                    loader?
                                    <tr>
                                        <td colSpan="9">
                                            <Loader/>
                                        </td>
                                    </tr>  
                                    :
                                    (currentItem.length>0)?
                                        currentItem.map((data,key)=>(
                                            <tr key={data._id}>
                                                <td>{key}</td>
                                                <td>{data.userData.name}</td>
                                                <td> 
                                                    <Link href={`/order/detail/${data.orderData._id}`}>
                                                        <a>
                                                            {data.orderData.orderNumber}
                                                        </a>
                                                    </Link>
                                                </td>
                                                <td>
                                                    <ul>
                                                        <li>Rating: {data.rateType}</li>
                                                        <li>Description: {data.description}</li>
                                                        <li>Date: {moment(data.createdAt).format('ll')}</li>
                                                    </ul>
                                                </td>
                                            </tr>
                                        ))
                                    :
                                        <tr>
                                            <td colSpan="9">no data found</td>
                                        </tr>
                                }
                            </tbody>
                        </Table>
                        </CardBody>
                        <CardFooter className="py-4">
                            <nav aria-label="...">
                                {
                                    (paginationData)?
                                        <PaginationServer 
                                            data={paginationData}
                                            pagFun={pageChange}
                                        />
                                    :null        
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
Index.layout = Vendor
export default Index