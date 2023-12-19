import React, { useEffect } from "react";
import Router,{ useRouter } from "next/router";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";
import { getProfile } from "reducers/authSlice";
import { useDispatch, useSelector } from "react-redux";
function Admin(props) {
  // used for checking current route
  const router = useRouter();
  let mainContentRef = React.createRef();
  React.useEffect(() => {
    if(!localStorage.getItem('auth-token')){
        Router.push('/login')
    }
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContentRef.current.scrollTop = 0;
  }, []);
  const userDetails = useSelector(state=> state.authSlice.loggedInUser);
  const dispatch = useDispatch()
  useEffect(()=>{
    if (userDetails.data._id=="" && localStorage.getItem('auth-token')) {
      dispatch(getProfile())
    }   
  },[userDetails]);

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        logo={{
          innerLink: "/",
          imgSrc: require('assets/img/brand/logo_color.svg'),
          imgAlt: "...",
        }}
      />
      <div className="main-content" ref={mainContentRef}>
        <AdminNavbar {...props} />
        {props.children}
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
}

export default Admin;
