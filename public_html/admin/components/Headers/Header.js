import React, { useEffect, useState } from "react";

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { useDispatch, useSelector } from 'react-redux';
import { getDashboardData } from "../../reducers/cmsSlice"
function Header() {

  const dispatch = useDispatch()
  const data = useSelector(state=>state.cmsSlice.dashboardList);
  const [dashboard, setDashboard] = useState("")
  useEffect(() => {
    dispatch(getDashboardData());   
  }, [])
  useEffect(() => {
    if(!data.isLoading){
      setDashboard(data.data) 
    } 
  }, [data])
  return (
    <>
      <div className="header bg-gradient-success pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              { data.isLoading 
                  ? "Loading...." 
                  : dashboard 
                    ? dashboard?.userCount.map((item) => (
                        <Col lg="6" xl="3" key={item._id}>
                          <Card className="card-stats mb-4 mb-xl-0">
                            <CardBody>
                              <Row>
                                <div className="col">
                                  <CardTitle
                                    tag="h5"
                                    className="text-uppercase text-muted mb-0"
                                  >
                                    {item._id}
                                  </CardTitle>
                                  <span className="h2 font-weight-bold mb-0">
                                    {item.userCount}
                                  </span>
                                </div>
                                <Col className="col-auto">
                                  <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                    <i className="fas fa-users" />
                                  </div>
                                </Col>
                              </Row>
                              <p className="mt-3 mb-0 text-muted text-sm">
                                {/* <span className="text-success mr-2">
                                  <i className="fa fa-arrow-up" /> 3.48%
                                </span>{" "}
                                <span className="text-nowrap">Since last month</span> */}
                              </p>
                            </CardBody>
                          </Card>
                        </Col>
                      ))  
                    : ""  
              }
              { data.isLoading 
                  ? "Loading...." 
                  : dashboard 
                    ? 
                      <Col lg="6" xl="3">
                        <Card className="card-stats mb-4 mb-xl-0">
                          <CardBody>
                            <Row>
                              <div className="col">
                                <CardTitle
                                  tag="h5"
                                  className="text-uppercase text-muted mb-0"
                                >
                                  Total Revenue
                                </CardTitle>
                                <span className="h2 font-weight-bold mb-0">£{(dashboard?.allOrderAmount?.totalEarning).toFixed(2)}</span>
                              </div>
                              <Col className="col-auto">
                                <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                                  <i className="fas fa-chart-bar" />
                                </div>
                              </Col>
                            </Row>
                            <p className="mt-3 mb-0 text-muted text-sm">
                              {/* <span className="text-success mr-2">
                                <i className="fas fa-arrow-up" /> 12%
                              </span>{" "}
                              <span className="text-nowrap">Since last month</span> */}
                            </p>
                          </CardBody>
                        </Card>
                      </Col>
                    : ""
              }
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
}

export default Header;
