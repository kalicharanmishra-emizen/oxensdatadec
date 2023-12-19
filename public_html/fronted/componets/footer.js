import { Container, Row, Col, Badge} from 'reactstrap'
import Link from 'next/link'


export default function Footer({authrize}) {    
    return (
        <>
        <footer className="footer">
          <Container> 
            <Row>
              <Col sm="10">
                <div className="footer-link">
                  <ul>
                      <li><Link href="/"><a>Home</a></Link></li>
                      {!authrize?
                          <>
                            <li><Link href="/become-a-rider"><a>Become a Rider</a></Link></li>
                            <li><Link href="/register-a-store"><a>Register as Store</a></Link></li>
                          </>
                        :""
                      }
                      <li><Link href="/careers"><a>Career</a></Link></li>
                  </ul>
                </div>
                <div className="copyright">
                  <ul>
                    <li>&copy; {new Date().getFullYear()} oxens.com. All rights reserved.</li>
                    <li><Link href="/terms-and-conditions"><a>Terms of Services</a></Link></li>
                    <li><Link href="/privacy-policy"><a>Privacy Policy</a></Link></li>
                  </ul>
                </div>
              </Col>
            </Row>
          </Container>
        </footer>
        </>
      )

}