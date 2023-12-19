import React, { useState,useEffect } from 'react';
import InnerHeader from '../componets/inner-header'
import Footer from '../componets/footer'
import { useDispatch, useSelector } from 'react-redux';
import { getAuthUser } from '../reducers/authSlice';

const linnerlayout=(props)=> {
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
      <InnerHeader
        authrize={authrize}
      />
        {props.children}
      <Footer
        authrize={authrize}
      />
    </>
  )


  
}
export default linnerlayout;