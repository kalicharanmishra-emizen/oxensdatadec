import React, { useState,useEffect } from 'react';
import Header from '../componets/header'
import Footer from '../componets/footer'
import { useDispatch, useSelector } from 'react-redux';
import { getAuthUser } from '../reducers/authSlice';
const HomeLayout=(props)=> {
  const dispatch = useDispatch()
  const userDetails = useSelector(state=> state.authSlice.loggedInUser)
  const [authrize, setAuthrize] = useState(false)
  useEffect(() => {
    if (localStorage.getItem('auth-user-token') && userDetails.data._id=="") {
      dispatch(getAuthUser())
    }
    if(userDetails.data._id!=""){
      props.socket.emit('connectUser',{
        userId:userDetails.data._id
      })
      setAuthrize(true)
    }
  }, [userDetails])
  return (
    <>
      <Header authrize={authrize}/>
        {props.children}
      <Footer authrize={authrize}/>
    </>
  )
    
}
export default HomeLayout;

