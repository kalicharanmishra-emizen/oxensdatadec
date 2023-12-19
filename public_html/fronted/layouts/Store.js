import React, { useState,useEffect } from 'react';
import StoreHeader from '../componets/StoreHeader'
import Footer from '../componets/footer'
import { useDispatch, useSelector } from 'react-redux';
import { getAuthUser } from '../reducers/authSlice';

const Storelayout=(props)=> {
  const dispatch = useDispatch()
  const userDetails = useSelector(state=> state.authSlice.loggedInUser)
  const [authrize, setAuthrize] = useState(false)
  useEffect(() => {
    // console.log("localStorage.getItem('auth-user-token')",localStorage.getItem('auth-user-token'));
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
      <StoreHeader
        authrize={authrize}
      />
        {props.children}
      <Footer
        authrize={authrize}
      />
    </>
  )


  
}
export default Storelayout;