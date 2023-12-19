import { Container, Row, Col,Form, Label, FormGroup, Input, Button} from 'reactstrap'
import IinnerLayout from "../layouts/linnerlayout"
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from "../styles/become-rider.module.css";
import work5 from '../public/images/img5.svg';
import work7 from '../public/images/img7.svg';
import work6 from '../public/images/img6.svg';
import appStore from '../public/images/appStore.png';
import playStore from '../public/images/playStore.png';




function BecomeRider() {  

    return (
      <>
            <section className={`${styles.banner} ${styles.bannerStyleTwo}`}>
                <Container fluid className="p-0">
                    <Row className="m-0">
                        <Col xl="8" lg="7" className="p-0">
                            <div className={`${styles.imgBlock}`}>
                                {/* <Image src={img4} alt="Img3" /> */}
                            </div>
                        </Col>
                        <Col xl="4" lg="5" className="p-0">
                            <div className={`${styles.bannerForm}`}>
                                <h6>Become a Driver</h6>
                                <Form>
                                    <FormGroup className="form-floating">
                                        <Input type="text" id="full_name" className={`${styles.formControl}`} placeholder="" />
                                        <label htmlFor="full_name">Full Name</label>
                                    </FormGroup>
                                    <FormGroup className="form-floating">
                                        <Input type="email" id="" className={`${styles.formControl}`} placeholder="" />
                                        <label htmlFor="Email">Email</label>
                                    </FormGroup>
                                    <FormGroup className="form-floating">
                                        <span className={`${styles.borderLeft}`}></span>
                                        <Input type="text" id="mobile_number" className={`${styles.number}`} name="mobile" placeholder="" />
                                        <label htmlFor="mobile_number">Mobile Number</label>
                                    </FormGroup>
                                    <div className={`${styles.btnBlock}`}>
                                        <Button type="submit" className={`${styles.oxensBtn}`}>Submit</Button>
                                    </div>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className={`${styles.workUs}`}>
                <Container>
                    <div className={`${styles.sectionTitle}`}>
                        <h2>Work With Us</h2>
                    </div>
                    <Row>
                        <Col lg="4" md="6">
                        <div className={`${styles.workWrap}`}>
                            <div className={`${styles.imgBlock}`}>
                            <Image src={work5} alt="Banner Img" />
                            </div>
                            <h4>Register as a Rider</h4>
                        </div>
                        </Col>
                        <Col lg="4" md="6">
                        <div className={`${styles.workWrap}`}>
                            <div className={`${styles.imgBlock}`}>
                            <Image src={work7} alt="Banner Img" />
                            </div>
                            <h4>Get verified by Oxens</h4>
                        </div>
                        </Col>
                        <Col lg="4" md="6">
                        <div className={`${styles.workWrap}`}>
                            <div className={`${styles.imgBlock}`}>
                            <Image src={work6} alt="Banner Img" />
                            </div>
                            <h4>Start getting orders for delivery </h4>
                        </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className={`${styles.callOut}`}>
                <Container>
                    <div className={`${styles.callOutWrap}`}>
                        <h5>Try our driver app</h5>
                        <div className={`${styles.btnBlock}`}>
                            <Link href="#0"><a>
                                <Image src={appStore} alt="App Store" />
                            </a></Link>
                            <Link href="#0"><a>
                                <Image src={playStore} alt="Play Store" />
                            </a></Link>
                        </div>
                    </div>
                </Container>
            </section>
      </>
  )
}
BecomeRider.layout = IinnerLayout
export default BecomeRider