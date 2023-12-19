import Vendor from "layouts/Vendor";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import UserHeader from "components/Headers/UserHeader";
import { useDispatch, useSelector } from "react-redux";
import { posorderDetail } from "../../../reducers/storeSlice";
import {
  getPaymentStatusColor,
  getPaymentStatusText,
  orderTypeColor,
  orderTypeText,
  paymentModeColor,
  paymentModeText,
  paymentStatusColor,
  paymentStatusText,
} from "../../../Helper/helper";
import {
  Badge,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Row,
  Table,
} from "reactstrap";
import nProgress from "nprogress";
import moment from "moment";

const Posdetail = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { posdetail } = router.query;
  const orderDetail = useSelector((state) => state.storeSlice.detail);
  const [data, setData] = useState({});

  useEffect(() => {
    nProgress.start();
    if (posdetail != undefined) {
      dispatch(posorderDetail({ orderId: posdetail }));
    }
  }, [posdetail]);

  useEffect(() => {
    if (orderDetail) {
      nProgress.done();
      setData(orderDetail);
    }
  }, [orderDetail]);
  return (
    <>
      <UserHeader />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
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
                      onClick={(e) => {
                        e.preventDefault();
                        router.push("/posorder");
                      }}
                    >
                      Back
                    </Badge>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody className="bg-white">
                <Row>
                  <Col xl="3" className="mt-2">
                    Order Number : <b>{data.orderNumber}</b>
                  </Col>
                  <Col xl="3" className="mt-2">
                    Payment Mode :
                    <Badge
                      role="button"
                      id={data._id}
                      color={paymentModeColor(data.paymentMode)}
                    >
                      {paymentModeText(data.paymentMode)}
                    </Badge>
                  </Col>
                  <Col xl="3" className="mt-2">
                    Order Type :
                    <Badge
                      role="button"
                      id={data._id}
                      color={orderTypeColor(data.orderType)}
                    >
                      {orderTypeText(data.orderType)}
                    </Badge>
                  </Col>
                  <Col xl="3" className="mt-2">
                    Payment Status :
                    <Badge className="ml-1" role="button" color="success">
                      success
                    </Badge>
                  </Col>
                  <Col xl="3" className="mt-2">
                    Total Quantity : <b>{data.totalQuantity}</b>
                  </Col>
                  <Col xl="3" className="mt-2">
                    Total MRP : <b>£{Number(data.totalMrp).toFixed(2)}</b>
                  </Col>
                  <Col xl="3" className="mt-2">
                    Discount Price : <b>£{data.discountPrice}</b>
                  </Col>
                  <Col xl="3" className="mt-2">
                    Final Price :{" "}
                    <b>
                      £
                      {(
                        Number(data.totalMrp) - Number(data.discountPrice)
                      ).toFixed(2)}
                    </b>
                  </Col>
                  <Col xl="12" className="mt-4 border">
                    <Row className="mb-4">
                      <Col xl="12" className="mt-2 mb-2">
                        <b> User Details </b>
                      </Col>
                      <Col xl="3" className="mt-2">
                        Name : <b>{data.userData ? data.userData.name : ""}</b>
                      </Col>
                      <Col xl="3" className="mt-2">
                        Email :{" "}
                        <b>{data.userData ? data.userData.email : ""}</b>
                      </Col>
                      <Col xl="3" className="mt-2">
                        Phone No :{" "}
                        <b>{data.userData ? data.userData.phoneNo : ""}</b>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="12">
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
                    {data.orderProduct
                      ? data.orderProduct.map((list) => (
                          <tr key={list._id}>
                            <th>{list.title}</th>
                            <td>
                              <ul className="m-0 p-0">
                                {list.customize.map((cus) => (
                                  <li>
                                    {`${cus.title} : `}
                                    {cus.variants.map((ver) => ver.title)}
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td>{list.quantity}</td>
                            <td>
                              <b> £{list.price.toFixed(2)}</b>
                            </td>
                          </tr>
                        ))
                      : null}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};
Posdetail.layout = Vendor;
export default Posdetail;
