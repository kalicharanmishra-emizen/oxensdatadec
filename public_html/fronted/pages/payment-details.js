import { Container, Row, Col} from 'reactstrap'
import IinnerLayout from "../layouts/linnerlayout"
import React, { useState } from 'react';
import styles from "../styles/payment-details.module.css";

function PaymentDetails() {
    return (
      <>
          <section className={`${styles.detailBanner}`}>
            <Container>
              <Row className="justify-content-center">
                <Col md="2">
                 <div className={`${styles.detailTitle}`}>
                    <span>Order Details</span> 
                  </div> 
                </Col>
                <Col md="2">
                 <div className={`${styles.detailTitle}`}>
                    <span className={`${styles.active}`}>Payment Details</span> 
                  </div> 
                </Col>
              </Row>
            </Container>
          </section>

          <section className={`${styles.paymentMathod}`}>
            <Container>
              <div className={`${styles.paymentWrap}`}>
                
              </div>
            </Container>
          </section>
      </>
  )
}
PaymentDetails.layout = IinnerLayout
export default PaymentDetails