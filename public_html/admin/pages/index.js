import React, { useState, useEffect } from "react";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";
import { useDispatch, useSelector } from 'react-redux';
import Header from "components/Headers/Header.js";
import { getDashboardData } from "../reducers/cmsSlice"
import { getMonth, yearlyEarningChart } from "../Helper/helper";

const Dashboard = (props) => {
  const dispatch = useDispatch()
  const data = useSelector(state=>state.cmsSlice.dashboardList);
  const [dashboard, setDashboard] = useState("")
  const [label, setLabel] = useState("")
  const [label2, setLabel2] = useState("")
  const [orderData, setOrderData] = useState(0)
  const [yearlySale, setYearlySale] = useState(0)
  // const [activeNav, setActiveNav] = React.useState(1);
  // const [chartExample1Data, setChartExample1Data] = React.useState("data1");
  
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };

  const getTotalOrderData = () => {

    let temp=[];
    let temp2=[];
    let tempOrderData = [];
    let tempOrderData2 = [];

    dashboard?.monthlyOrders?.thisYearOrders?.map((item) => {
      temp.push(getMonth(item._id))
      tempOrderData.push(item.monthOrder)
    })
    dashboard?.monthlyOrders?.thisYearSales?.map((item) => {
      temp2.push( getMonth(item._id) )
      tempOrderData2.push( Number((item.monthSale).toFixed(2)) )
    })
    
    setLabel(temp)
    setOrderData(tempOrderData)
    setLabel2(temp2)
    setYearlySale(tempOrderData2)
  }

   // Colors
   var colors = {
    gray: {
      100: "#f6f9fc",
      200: "#e9ecef",
      300: "#dee2e6",
      400: "#ced4da",
      500: "#adb5bd",
      600: "#8898aa",
      700: "#525f7f",
      800: "#32325d",
      900: "#212529",
    },
    theme: {
      default: "#172b4d",
      primary: "#5e72e4",
      secondary: "#f4f5f7",
      info: "#11cdef",
      success: "#2dce89",
      danger: "#f5365c",
      warning: "#fb6340",
    },
    black: "#12263F",
    white: "#FFFFFF",
    transparent: "transparent",
  };

  let monthlySale = {
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              callback: function (value) {
                if (!(value % 10)) {
                  //return '$' + value + 'k'
                  return value;
                }
              },
            },
          },
        ],
      },
      tooltips: {
        callbacks: {
          label: function (item, data) {
            var label = data.datasets[item.datasetIndex].label || "";
            var yLabel = item.yLabel;
            var content = "";
            if (data.datasets.length > 1) {
              content += label;
            }
            content += yLabel;
            return content;
          },
        },
      },
    },
    data: {
      labels: label,
      datasets: [
        {
          label: "Sales",
          data: orderData,
          maxBarThickness: 10,
        },
      ],
    },
  };

  let thisYearRevenue = {
    options: {
      scales: {
        yAxes: [
          {
            gridLines: {
              color: colors.gray[900],
              zeroLineColor: colors.gray[900],
            },
            ticks: {
              callback: function (value) {
                if (!(value % 10)) {
                  return "£" + value + "";
                }
              },
            },
          },
        ],
      },
      tooltips: {
        callbacks: {
          label: function (item, data) {
            var label = data.datasets[item.datasetIndex].label || "";
            var yLabel = item.yLabel;
            var content = "";
  
            if (data.datasets.length > 1) {
              content += label;
            }
  
            content += "£" + yLabel + "";
            return content;
          },
        },
      },
    },
    data2: (canvas) => {
      return {
        labels: label2,
        datasets: [
          {
            label: "Performance",
            data: yearlySale,
          },
        ],
      };
    },
  };
  
  useEffect(() => {
    dispatch(getDashboardData());   
  }, [])
  useEffect(() => {
    if(!data.isLoading){
      setDashboard(data.data) 
    } 
    getTotalOrderData()
  }, [data])

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview
                    </h6>
                    <h2 className=" mb-0">Sales value</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Line
                    data={thisYearRevenue.data2}
                    options={thisYearRevenue.options}
                    getDatasetAtEvent={(e) => console.log(e)}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="12" className="mt-5">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      Performance
                    </h6>
                    <h2 className="mb-0">Total orders</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Bar
                    data={monthlySale.data}
                    options={monthlySale.options}
                  />
                  </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Top Saling Restaurent</h3>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Store Name</th>
                    <th scope="col">Total Order</th>
                    <th scope="col">Delivered Order</th>
                    <th scope="col">Pending Order</th>
                    <th scope="col">Refund Order</th>
                  </tr>
                </thead>
                { data.isLoading 
                    ? "loading...."
                    : !dashboard 
                      ? ""
                      : dashboard?.topSellingStores.map((item) => (
                        <tbody>
                          <tr>
                            <th scope="row">{ item.storeName }</th>
                            <td>{ item.totalCount }</td>
                            <td>{ item.deliveredOrders }</td>
                            <td>{ item.pendingOrders }</td>
                            <td>{ item.refundOrders }</td>
                          </tr>
                        </tbody>
                      ))   
                }
              </Table>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Top Buyers Users</h3>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">User Name</th>
                    <th scope="col">Total Order</th>
                    <th scope="col">Delivered Order</th>
                    <th scope="col">Pending Order</th>
                    <th scope="col">Refund Order</th>
                    <th scope="col">Total Amount</th>
                  </tr>
                </thead>
                { data.isLoading 
                    ? "loading...."
                    : !dashboard 
                      ? ""
                      : dashboard?.topBuyers.map((item) => (
                        <tbody>
                          <tr>
                            <th scope="row">{ item.userName }</th>
                            <td>{ item.totalOrders }</td>
                            <td>{ item.deliveredOrders }</td>
                            <td>{ item.pendingOrders }</td>
                            <td>{ item.refundOrders }</td>
                            <td>£ { item.deliveredOrdersAmount }</td>
                          </tr>
                        </tbody>
                      ))   
                }
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

Dashboard.layout = Admin;

export default Dashboard;
