// reactstrap components
import {
  Button, Card, CardBody, NavItem, NavLink, Nav, Table, Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Badge, TabContent, TabPane,
} from "reactstrap";
// layout for this page
import Vendor from "layouts/Vendor";
import UserHeader from "components/Headers/UserHeader";
import {getActiveOrder} from '../reducers/orderSlice'
import { useDispatch,useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loader from "../components/ApiLoader/loader";
import moment from "moment";
import { callApi, getPaymentStatusColor, getPaymentStatusText, paymentMode, paymentStatusColor, paymentStatusText } from "../Helper/helper";
import _ from 'lodash'

const Dashboard = ({socket}) => {
  const dispatch =  useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [order,setOrder]=useState({})
  const [orderList,setOrderList]= useState({
    pending:[],
    accpet:[],
    complete:[]
  })
  const [orderModel,setOrderModel] = useState(false)
  const [activeTab, setActiveTab] = useState('pending')
  const activeList = useSelector(state=>state.orderSlice.activeOrder)
  const authUser = useSelector(state=>state.authSlice.loggedInUser)
  const [packageData,setPacakageData] = useState({
    error:null,
    value:"0"
  })
  useEffect(()=>{
    dispatch(getActiveOrder())
  },[])
  useEffect(()=>{
    if (!activeList.isLoading) {
      const grouped = _.groupBy(activeList.data, list => list.status);
      setOrderList({
        pending:grouped[0]?grouped[0]:[],
        accpet:grouped[1]?grouped[1]:[],
        complete:grouped[2]?grouped[2]:[]
      })
      
    }
  },[activeList])
  // all new order recived socket
  useEffect(()=>{
    socket.on('placeOrder',data=>{
      dispatch(getActiveOrder())
      // if (data.storeId==authUser.data._id) {
      // }
    })
    // run cleanup function
    // return ()=>{
    //   socket.off(placeOrder)
    // }
  },[socket])
  
  const showDetail = (e) =>{
    let tempObj = activeList.data.find(temp=>temp._id==e.target.getAttribute('value'))
    if (tempObj!=undefined) {
      setOrder(tempObj)
      setOrderModel(!orderModel)
    }
  }
  const closeDetailModal = () => {
    setOrder({})
    setPacakageData({
      error:null,
      value:"1"
    })
    setOrderModel(!orderModel)
  }
  const handelPackageType = (e)=>{
    if (e.target.value!='') {
      setPacakageData({
        error:null,
        value:e.target.value
      })
    }else{
      setPacakageData({
        error:"",
        value:''
      })
    }
  }
  const orderSubmit = (status)=>{
    if (status=='reject') {
        Swal.fire({
          title: 'Are you sure?',
          text: `You want to refund this order`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes'
        }).then(async (result) => {
          if (result.isConfirmed) {
              try {
                setIsLoading(true)
                  await callApi('post','/order/orderStatusUpdate',{
                    id:order._id,
                    statusType:'refund'
                  })
                  dispatch(getActiveOrder())
                  Swal.fire({
                      icon: 'success',
                      title: `Order No.${order.orderNumber} Reject`,
                      showConfirmButton: false,
                      timer: 1500
                  })
                  setIsLoading(false)
                  setOrderModel(false)
              } catch (error) {
                  Swal.fire({
                      icon: 'danger',
                      title: 'Somthing went wrong',
                      showConfirmButton: false,
                      timer: 1500
                  })
              }
          }
        })
    }else{
      console.log("packageData.value", packageData.value);
      Swal.fire({
        title: 'Are you sure?',
        text: `You want to accpet this order with ${ Number(packageData.value) !== 3 ?  Number(packageData.value) === 2 ? "Medium" : "Small" : "Large"  } package type`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then(async (result) => {
        if (result.isConfirmed) {
            try {
              await callApi('post','/order/orderStatusUpdate',{
                id:order._id,
                statusType:'accpet',
                packageType:packageData.value
              })
              dispatch(getActiveOrder())
              Swal.fire({
                  icon: 'success',
                  title: `Order No.${order.orderNumber} accpet`,
                  showConfirmButton: false,
                  timer: 1500
              })
              setOrderModel(false)
            } catch (error) {
                Swal.fire({
                    icon: 'danger',
                    title: 'Somthing went wrong',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        }
      })
    }
    
  }
  const changeOrderStatus = (e) =>{
    console.log('id',e.target.getAttribute('value'));
    let order= activeList.data.find(temp=>temp._id==e.target.getAttribute('value'))
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to update Order No.${order.orderNumber} status`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then(async (result) => {
      if (result.isConfirmed) {
          try {
              await callApi('post','/order/orderStatusUpdate',{
                id:order._id,
              })
              dispatch(getActiveOrder())
              Swal.fire({
                  icon: 'success',
                  title: `Order No.${order.orderNumber} status update`,
                  showConfirmButton: false,
                  timer: 1500
              })
              setOrderModel(false)
          } catch (error) {
              Swal.fire({
                  icon: 'error',
                  title: 'Somthing went wrong',
                  showConfirmButton: false,
                  timer: 1500
              })
          }
      }
    })
  }
  const noRefCheck = (tab) => {
    let value = tab.target.getAttribute('key-value')
    setActiveTab(value)
  }
  const orderDeliverdModel = (e) =>{
    let order= activeList.data.find(temp=>temp._id==e.target.getAttribute('value'))
    Swal.fire({
      title: 'Enter Delivery Code',
      html: `<input type="text" id="code" class="swal2-input" placeholder="Delivery Code">`,
      confirmButtonText: 'Submit',
      focusConfirm: false,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        const code = Swal.getPopup().querySelector('#code').value
        if (code=='' || !code.match(/^[1-9][0-9]{3,3}$/)) {
          return Swal.showValidationMessage(`Please enter a valid code`)
        }
        return callApi('post','/order/orderStatusUpdate',{
          id:order._id,
          code:code
        }).then(data=>{
          return data;
        }).catch(error=>{
          Swal.showValidationMessage(error.message)
        })
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then(async(result) => {
      if (result.isConfirmed) {
        dispatch(getActiveOrder())
        Swal.fire({
            icon: 'success',
            title: `Order No.${order.orderNumber} status update`,
            showConfirmButton: false,
            timer: 1500
        })
        setOrderModel(false)
      }
    })
  }
console.log("orderList", orderList);
console.log("order", order);
  return (
    <>
      <UserHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <div className="bg-secondary card tabs-Block">
          <Row className="m-0">
            <Nav tabs>
              <NavItem>
                <NavLink className={(activeTab=='pending')?'active':''} key-value="pending" onClick={noRefCheck} >Pending </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={(activeTab=='accpet')?'active':''} key-value="accpet" onClick={noRefCheck} >In Proccess</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className={(activeTab=='complete')?'active':''} key-value="complete" onClick={noRefCheck} >Complete</NavLink>
              </NavItem>
            </Nav>
          </Row>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="pending">
              <div className="px-2 bg-white shadow custom-min-height">
                  <Row>
                    {
                      activeList.isLoading?
                        <Col xl="4">
                          <Card className="mt-2 shadow">
                            <CardBody>
                              <Loader/>
                            </CardBody>
                          </Card>
                        </Col> 
                      :
                        orderList.pending.length!=0?
                          orderList.pending.map(list=>(
                            <Col xl="4" key={list._id}>
                              <Card className="mt-2 shadow">
                                <CardBody>
                                  <h3>
                                    Order Number: #{list.orderNumber} 
                                  </h3>
                                  <p>
                                    Type:- <b>{ list.type? "Pickup" : "Delivery" }</b>
                                  </p>
                                  {/* <p>
                                    Order Type:- <b>{ list?.orderType !== null ? list?.orderType === 0 ? "Online" : "POS" : "" }</b>
                                  </p> */}
                                  <p className="mt-0">
                                    Create at : {moment(list.createdAt).format('YYYY-MM-DD LT')}
                                  </p>
                                  <ul
                                    className="list-unstyled row"
                                  >
                                    <li className="col-xl-6">
                                      Quantity:{list.totalQuantity}
                                    </li>
                                    <li className="col-xl-6">
                                      Price: £{(Number(list.totalMrp)-Number(list.discountPrice)).toFixed(2)}
                                    </li>
                                  </ul>
                                    <Button
                                      color="primary"
                                      className="w-100"
                                      value={list._id}
                                      onClick={showDetail}
                                    >
                                      Action
                                    </Button>
                                </CardBody>
                              </Card>
                            </Col>
                          ))
                        :
                          <Col xl="12" className="custom-min-height d-flex justify-content-center align-items-center">
                            <h3>
                              No Data Available
                            </h3>
                          </Col>
                    }
                  </Row>
              </div>
            </TabPane>
            <TabPane tabId="accpet">
              <div className="px-2 bg-white shadow custom-min-height">
                  <Row>
                    {
                      activeList.isLoading?
                        <Col xl="4">
                          <Card className="mt-2 shadow">
                            <CardBody>
                              <Loader/>
                            </CardBody>
                          </Card>
                        </Col> 
                      :
                        orderList.accpet.length!=0?
                          orderList.accpet.map(list=>(
                            <Col xl="4" key={list._id}>
                              <Card className="mt-2 shadow">
                                <CardBody>
                                  <h3>
                                    Order Number: #{list.orderNumber} 
                                    <i 
                                      className="ni ni-zoom-split-in float-right mt-1" 
                                      onClick={showDetail}
                                      value={list._id}
                                      role="button"
                                    />
                                  </h3>
                                  <p>
                                    Type:- <b>{ list.type? "Pickup" : "Delivery" }</b>
                                  </p>
                                  <p>
                                    Order Type:- <b>{ list?.orderType !== null ? list?.orderType === 0 ? "Online" : "POS" : "Online" }</b>
                                  </p>
                                  <p className="mt-0">
                                    Create at : {moment(list.createdAt).format('YYYY-MM-DD LT')}
                                  </p>
                                  <ul
                                    className="list-unstyled row"
                                  >
                                    <li className="col-xl-6">
                                      Quantity:{list.totalQuantity}
                                    </li>
                                    <li className="col-xl-6">
                                      Price: £{(Number(list.totalMrp)-Number(list.discountPrice)).toFixed(2)}
                                    </li>
                                  </ul>
                                  <Button
                                    color="primary"
                                    className="w-100"
                                    value={list._id}
                                    onClick={changeOrderStatus}
                                  >
                                    Ready to pickup
                                  </Button>
                                </CardBody>
                              </Card>
                            </Col>
                          ))
                        :
                          <Col xl="12" className="custom-min-height d-flex justify-content-center align-items-center">
                            <h3>
                              No Data Available
                            </h3>
                          </Col> 
                    }
                  </Row>
              </div>
            </TabPane>
            <TabPane tabId="complete">
              <div className="px-2 bg-white shadow custom-min-height">
                  <Row>
                    {
                      activeList.isLoading?
                        <Col xl="4">
                          <Card className="mt-2 shadow">
                            <CardBody>
                              <Loader/>
                            </CardBody>
                          </Card>
                        </Col> 
                      :
                        orderList.complete.length!=0?
                          orderList.complete.map(list=>(
                            <Col xl="4" key={list._id}>
                              <Card className="mt-2 shadow">
                                <CardBody>
                                  <h3>
                                    Order Number: #{list.orderNumber} 
                                    <i 
                                      className="ni ni-zoom-split-in float-right mt-1" 
                                      onClick={showDetail}
                                      value={list._id}
                                      role="button"
                                    />
                                  </h3>
                                  <p>
                                    Type:- <b>{ list.type? "Pickup" : "Delivery" }</b>
                                  </p>
                                  <p>
                                    Order Type:- <b>{ list?.orderType !== null ? list?.orderType === 0 ? "Online" : "POS" : "Online" }</b>
                                  </p>
                                  <p className="mt-0">
                                    Create at : {moment(list.createdAt).format('YYYY-MM-DD LT')}
                                  </p>
                                  <ul
                                    className="list-unstyled row"
                                  >
                                    <li className="col-xl-6">
                                      Quantity:{list.totalQuantity}
                                    </li>
                                    <li className="col-xl-6">
                                      Price: £{(Number(list.totalMrp)-Number(list.discountPrice)).toFixed(2)}
                                    </li>
                                  </ul>
                                  {
                                    list.type===0?
                                      <h3>Delivery Code:- {list.vendorCode}</h3> 
                                    :
                                      <Button
                                        color="primary"
                                        className="w-100"
                                        value={list._id}
                                        onClick={orderDeliverdModel}
                                      >
                                        Deliverd Item
                                      </Button>
                                  }
                                </CardBody>
                              </Card>
                            </Col>
                          ))
                        :
                          <Col xl="12" className="custom-min-height d-flex justify-content-center align-items-center">
                            <h3>
                              No Data Available
                            </h3>
                          </Col> 
                    }
                  </Row>
              </div>
            </TabPane>
          </TabContent>
        </div>
      </Container>
      <Modal
        key={12}
        className="modal-xl"
        isOpen={orderModel}
      >
        { 
          Object.keys(order).length == 0
          ?
            null
          :
            <>
              <ModalHeader tag="h2" toggle={closeDetailModal}>Order Number #{order.orderNumber} </ModalHeader>
              <ModalBody>
                <Row>
                  {/* <Col xl="4">
                    Order Number : <b>{order.orderNumber}</b>
                  </Col> */}
                  <Col xl="3" className="pb-2">
                    Status : 
                      <Badge 
                          className="ml-1"
                          role="button" 
                          color={getPaymentStatusColor(order.status)}
                      >
                        {getPaymentStatusText(order.status)}
                      </Badge>
                  </Col>
                  <Col xl="3" className="pb-2">
                    Driver status : 
                      <Badge 
                        className="ml-1"
                        role="button" 
                        color={order.driverAssignStatus?'success':'primary'}
                      >
                        {order.driverAssignStatus?'Assign':"Unassign"}
                      </Badge>
                  </Col>
                  <Col xl="3" className="pb-2">
                    Payment status :
                      <Badge 
                          className="ml-1"
                          role="button" 
                          color={paymentStatusColor(order?.paymentStatus)}
                      >
                        {paymentStatusText(order?.paymentStatus)}
                      </Badge>
                  </Col>
                  <Col xl="3" className="pb-2">
                    Order Type : {order?.orderType != null ? order?.orderType === 0 ? "Online" : "POS" : "Online"}
                  </Col>
                  <Col xl="3" className="pb-2">
                    Total Quantity : <b>{order.totalQuantity}</b>
                  </Col>
                  <Col xl="3" className="pb-2">
                    Total MRP : £<b>{Number(order.totalMrp).toFixed(2)}</b>
                  </Col>
                  <Col xl="3" className="pb-2">
                    Discount Price : £<b>{order.discountPrice}</b>
                  </Col>
                  <Col xl="3" className="pb-2">
                    Final Price : £<b>{(Number(order.totalMrp)-Number(order.discountPrice)).toFixed(2)}</b>
                  </Col>
                  { order?.paymentMode != null ? <Col xl="3" className="pb-2">
                    Payment Mode : <b>{paymentMode(order.paymentMode)}</b>
                  </Col>  : ""}
                  { order?.transectionIdPOS != null ? <Col xl="6" className="pb-2">
                    Transection ID : <s>{order.transectionIdPOS}</s>
                  </Col>  : ""}

                  { order?.venderPDF != null ? <Col xl="3" className="pb-2">
                      Vendor invoice :  
                      <a href={order?.venderPDF} target="_blank" rel="noopener noreferrer" style={{color:"#4a63ec"}}>
                        download
                      </a>
                  </Col> : ""}
                  { order?.collectionPDF != null ? <Col xl="3" className="pb-2">
                      Collection invoice :  
                      <a href={order?.collectionPDF} target="_blank" rel="noopener noreferrer" style={{color:"#4a63ec"}}>
                        download
                      </a>
                  </Col> : ""}
                  { order?.driverPDF != null ? <Col xl="3" className="pb-2">
                      Driver invoice :  
                      <a href={order?.driverPDF} target="_blank" rel="noopener noreferrer" style={{color:"#4a63ec"}}>
                        download
                      </a>
                  </Col> : ""}
                  { order?.userPDF != null ? <Col xl="3" className="pb-2">
                      user invoice :  
                      <a href={order?.userPDF} target="_blank" rel="noopener noreferrer" style={{color:"#4a63ec"}}>
                        download
                      </a>
                  </Col> : ""}
                  <Col xl="12" className="pb-2"></Col>
                  {
                    order?.orderType !== 1 
                    ?
                      order.type === 0 
                      ? 
                        <Col xl="6" className="mt-4 border">
                          <h3>
                            Delivery Address
                          </h3>
                          <span style={{fontSize:"14px"}}>{order.deliveryAddress.address}</span>
                        </Col>
                      :
                        <Col xl="6" className="mt-4 border">
                          <h3>
                            Pickup Detail
                          </h3>
                            <p> <b>Date:- </b> {order.pickupData.date} </p>
                            <p> <b>Time:- </b> {order.pickupData.time} </p>
                        </Col>
                    : 
                      <Col xl="6" className="mt-4 border">
                        <h3>
                          Pickup Detail
                        </h3>
                          <p> <b>Date:- </b> {moment(order?.createdAt).format("L")} </p>
                          <p> <b>Time:- </b> {moment(order?.createdAt).format("HH:mm")} </p>
                      </Col>
                  }
                  <Col xl="6" className="mt-4 border">
                    <h3>User Detail</h3>
                    <ul className="m-0 p-0">
                        <div>
                            Name : <b>{order.userData?order.userData.name:""}</b>
                        </div>
                        <div>
                            Email : <b>{order.userData?order.userData.email:""}</b>
                        </div>
                        <div>
                            Phone No. : <b>{order.userData?order.userData.phone_no:""}</b>
                        </div>
                    </ul>
                  </Col>
                  <Col xl="12" className="mt-4 border">
                    <h4>Item List</h4>
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
                          order.orderProduct?
                            order.orderProduct.map(list=>(
                              <tr key={list._id}>
                                  <th>
                                      <h4>{list.title}</h4>
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
                                      <h4>{list.quantity}</h4>
                                  </td>
                                  <td>
                                      <h4>{list.price.toFixed(2)}</h4>
                                  </td>
                              </tr>
                            ))
                          :
                          <tr>
                            <td colSpan="4">No Data</td>
                          </tr>
                      }
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </ModalBody>
              {
                order.status==0?
                  <ModalFooter className="px-0">
                    <Row className="w-100">
                      <Col xl="9">
                        <select onChange={handelPackageType} className="form-control">
                          <option value="" disabled>Select Package Type</option>
                          <option value="1" defaultValue={packageData.value === 1 ? true : false}>Small</option>
                          <option value="2">Medium</option>
                          <option value="3">Large</option>
                        </select>
                      </Col>
                      <Col xl="3">
                        <Button
                          disabled={packageData.error==""?true:false}
                          color="success"
                          onClick={()=>orderSubmit('accpet')}
                        >
                          Accpet
                        </Button>
                        <Button 
                          color="danger"
                          onClick={()=>orderSubmit('reject')}>
                          Reject
                        </Button>
                      </Col>
                    </Row>
                  </ModalFooter>
                :null
              }
            </>
        }
        
      </Modal>

    </>
  );
};

Dashboard.layout = Vendor;

export default Dashboard;
