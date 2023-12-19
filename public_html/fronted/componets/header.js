import { Container, Row, Col} from 'reactstrap'
import Image from 'next/image'
import Link from 'next/link'
import logo from '../public/images/logo.svg';
import star from '../public/images/star-icon.svg';
import SideMenu from './SideMenu';

export default function Header({authrize}) {
const navWrap=()=>{
  document.body.classList.add('navigation-open')
}
const closeNavWrap=()=>{
  document.body.classList=''
  document.body.classList.remove('navigation-open')
}
  return (
    <>
    <div className="nav-overlay" onClick={closeNavWrap}></div>
    <header className="header">
      <Container>
         <Row className="align-items-center">
           <Col sm="3" className="col-4">
            <div className="logo">
                <Link href="/">
                  <a><Image src={logo} alt="Oxens Logo" /></a>
                </Link>
            </div>
           </Col>
           <Col sm="9" className="col-8">
            <div className="header-right">
              <ul>
                {
                  !authrize?
                    <>
                      <li><Link href="/become-a-rider"><a><Image src={star} alt="Star Icon" />Become a Rider</a></Link></li>
                      <li><Link href="/login"><a>Login</a></Link></li>
                      <li><Link href="/signup"><a>Signup</a></Link></li>
                    </>
                  :''
                }
                <li className="toggle-block" onClick={navWrap}><Link href=""><a className="toggle-btn"><span></span></a></Link></li>
              </ul>
            </div>
           </Col>
          </Row> 
      </Container>      
      <SideMenu
        closeNavWrap={closeNavWrap}
        authrize={authrize}
      />
    </header>
    </>
  )

  
}