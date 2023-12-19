import Vendor from 'layouts/Vendor';
import {useRouter} from 'next/router';
import { useEffect, useState } from "react";
import UserHeader from 'components/Headers/UserHeader';
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetail } from '../../../reducers/orderSlice';
import { getPaymentStatusColor, getPaymentStatusText, paymentMode, paymentStatusColor, paymentStatusText } from '../../../Helper/helper';
import { Badge,Card, CardBody, CardFooter, CardHeader, Col, Container, Row, Table } from "reactstrap";
import nProgress from 'nprogress';
import moment from 'moment';
function Detail() {
    const dispatch = useDispatch()
    const router = useRouter()
    const {detail} = router.query
    const [data,setData] = useState({})
    const orderDetail = useSelector(state=>state.orderSlice.detail)
    useEffect(()=>{
        nProgress.start()
        if (detail!=undefined) {
            dispatch(getOrderDetail({orderId:detail}))
        }
    },[detail])
    useEffect(()=>{
        if (orderDetail) {
            nProgress.done()
            setData(orderDetail)
        }
    },[orderDetail])
    console.log("details", orderDetail);
    return (
        <>
            <UserHeader/>
            <Container className="mt--7" fluid>
                <Row>
                    <Col className="order-xl-1" xl='12'>
                        <Card className="bg-secondary shadow">
                            <CardHeader className="bg-white border-0">
                                <Row className="align-items-center">
                                <Col xl="8">
                                    <h3 className="mb-0">Order Detail</h3>
                                </Col>
                                <Col xl="4">
                                    <Badge
                                        className="float-right"
                                        color="warning"
                                        role="button"
                                        onClick={
                                            (e)=>{
                                                e.preventDefault()
                                                router.push('/order')
                                            }
                                        }
                                    >
                                        Back
                                    </Badge>
                                </Col>
                                </Row>
                            </CardHeader>
                            <CardBody className="bg-white">
                                <Row>
                                    <Col xl="3" className="pb-2">
                                        Order Number : <b>{data.orderNumber}</b>
                                    </Col>
                                    <Col xl="3" className="pb-2">
                                        Status : 
                                            <Badge 
                                                className="ml-1"
                                                role="button" 
                                                color={getPaymentStatusColor(data.status)}
                                            >
                                                    {getPaymentStatusText(data.status)}
                                            </Badge>
                                    </Col>
                                    <Col xl="3" className="pb-2">
                                        Payment Status : 
                                            <Badge 
                                                className="ml-1"
                                                role="button" 
                                                color={paymentStatusColor(data.paymentStatus)}
                                            >
                                                    {paymentStatusText(data.paymentStatus)}
                                            </Badge>
                                    </Col>
                                    <Col xl="3" className="pb-2">
                                        Order Type : {data?.orderType != null ? data?.orderType === 0 ? "Online" : "POS" : ""}
                                    </Col>
                                    <Col xl="3" className="pb-2">
                                        Total Quantity : <b>{data.totalQuantity}</b>
                                    </Col>
                                    <Col xl="3" className="pb-2">
                                        Total MRP : £<b>{Number(data.totalMrp).toFixed(2)}</b>
                                    </Col>
                                    <Col xl="3" className="pb-2">
                                        Discount Price : £<b>{data.discountPrice}</b>
                                    </Col>
                                    <Col xl="3" className="pb-2">
                                        Final Price : £<b>{(Number(data.totalMrp) - Number(data.discountPrice)).toFixed(2)}</b>
                                    </Col>
                                    { data?.paymentMode != null ? <Col xl="3" className="pb-2">
                                        Payment Mode : <b>{paymentMode(data.paymentMode)}</b>
                                    </Col>  : ""}
                                    { data?.transectionIdPOS != null ? <Col xl="6" className="pb-2">
                                        Transection ID : <s>{data.transectionIdPOS}</s>
                                    </Col>  : ""}

                                    { data?.venderPDF != null ? <Col xl="3" className="pb-2">
                                        Vendor invoice :  
                                        <a href={data?.venderPDF} target="_blank" rel="noopener noreferrer" style={{color:"#4a63ec"}}>
                                            download
                                        </a>
                                    </Col> : ""}
                                    { data?.collectionPDF != null ? <Col xl="3" className="pb-2">
                                        Collection invoice :  
                                        <a href={data?.collectionPDF} target="_blank" rel="noopener noreferrer" style={{color:"#4a63ec"}}>
                                            download
                                        </a>
                                    </Col> : ""}
                                    { data?.driverPDF != null ? <Col xl="3" className="pb-2">
                                        Driver invoice :  
                                        <a href={data?.driverPDF} target="_blank" rel="noopener noreferrer" style={{color:"#4a63ec"}}>
                                            download
                                        </a>
                                    </Col> : ""}
                                    { data?.userPDF != null ? <Col xl="3" className="pb-2">
                                        user invoice :  
                                        <a href={data?.userPDF} target="_blank" rel="noopener noreferrer" style={{color:"#4a63ec"}}>
                                            download
                                        </a>
                                    </Col> : ""}
                                    <Col xl="12" className="pb-2"></Col>
                                    <Col xl="12" className="mt-4 border">
                                        <Row>
                                            {
                                                data.type === 0
                                                ?
                                                <Col xl="6" className="border">
                                                    <h3>Delivery Address </h3>
                                                    <b>{data.deliveryAddress?data.deliveryAddress.address:""}</b>
                                                </Col>
                                                :
                                                <Col xl="6" className="border">
                                                    <h3>Pickup Detail </h3>
                                                    <p> <b>Date:- </b> {data.pickupData?.date} </p>
                                                    <p> <b>Time:- </b> {data.pickupData?.time} </p>
                                                </Col>
                                            }
                                            <Col xl="6">
                                                <h3>User Detail</h3>
                                                <ul className="m-0 p-0">
                                                    <div>
                                                        Name : <b>{data.userData?data.userData.name:""}</b>
                                                    </div>
                                                    <div>
                                                        Email : <b>{data.userData?data.userData.email:""}</b>
                                                    </div>
                                                    <div>
                                                        Phone No. : <b>{data.userData?data.userData.phone_no:""}</b>
                                                    </div>
                                                </ul>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col xl="12" className="border mt-2">
                                        <h4> Order Extra </h4>
                                        Comment : {data.comment}
                                    </Col>
                                    { 
                                        Object.keys(data?.ratingData ?? {}).length ?
                                        <Col xl="12" className="border">
                                            <h4>
                                                <p>{data.ratingData?.type} Rating</p>
                                            </h4>
                                            <b>
                                                Date :  {moment(data.ratingData?.createdAt).format("YYYY MMM DD")}
                                                <br/>
                                                Rating : {data.ratingData?.rateType}
                                                <br/>
                                                { data.ratingData.description ? `Description : ${data.ratingData.description}` : ""}
                                            </b>
                                        </Col> : ""
                                    }
                                </Row>            
                            </CardBody>
                        </Card>
                    </Col>
                    <Col className="order-xl-1" xl='12'>
                        <Card className="bg-secondary shadow">
                            <CardHeader tag="h3" className="bg-white border-0">
                                Order Product
                            </CardHeader>
                            <CardBody className="bg-white">
                            <Table className="align-items-center table-flush" responsive>
                                <thead className="thead-light">
                                    <tr>
                                        <th>Product Name</th>
                                        <th>Variants</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    data.orderProduct?
                                        data.orderProduct.map(list=>(
                                            <tr key={list._id}>
                                                <th>
                                                    {list.title}
                                                </th>
                                                <td>
                                                    <ul className="m-0 p-0">
                                                        {list.customize.map(cus=>(
                                                            <li>
                                                                {`${cus.title} : `}
                                                            {cus.variants.map(ver=>(
                                                                ver.title
                                                            ))}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td>
                                                    {list.quantity}
                                                </td>
                                                <td>
                                                    {list.price.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))
                                    :
                                        null
                                }
                                </tbody>
                            </Table>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>  
        </>
    )
}
Detail.layout = Vendor
export default Detail
