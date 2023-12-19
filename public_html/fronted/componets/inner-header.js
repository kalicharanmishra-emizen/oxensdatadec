import { Container, Row, Col} from 'reactstrap'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react';
import logo from '../public/images/logo-color.svg';
import SideMenu from './SideMenu';

export default function InnerHeader({authrize}) {
    useEffect(() => {
        document.body.classList=''
    }, []);
    const navWrap=()=>{
        if(document.body.classList.contains('navigation-open')){
            document.body.classList=''
        }else{
            document.body.classList=''
            document.body.classList.add('navigation-open')
        }
    }
    return (
    <>
    <div className="nav-overlay" onClick={navWrap}></div>
    <header className="header style-two">
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
                        <li className="toggle-block" onClick={navWrap}><span role="button"><a className="toggle-btn"><span></span></a></span></li>
                    </ul>
                    </div>
                </Col>
            </Row> 
        </Container>      
        <SideMenu
            closeNavWrap={navWrap}
            authrize={authrize}
        />
    </header>
    </>
  )


}