import React from "react";
import { Container, Row, Col} from "reactstrap";
import logo from 'assets/img/brand/logo_color.svg';

function Auth(props) {
  React.useEffect(() => {
    document.body.classList.add("bg-default");
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.classList.remove("bg-default");
    };
  }, []);
  return (
    <>
      <div className="main-content">  
        <div className="login-wrap">
          <div className="table-wrap">
            <div className="align-wrap">
              <Container className="pb-5">
                <Row className="justify-content-center">
                  <Col md="6 login-inner shadow">
                    <Row className="no-gutters">
                      <Col md="12">
                        <div className="text-center">
                          <img src={logo} className="w-50" alt="Logo" />
                        </div>
                        {props.children}
                      </Col>
                      
                    </Row>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>   
        </div>          
      </div>
    </>
  );
}

export default Auth;
