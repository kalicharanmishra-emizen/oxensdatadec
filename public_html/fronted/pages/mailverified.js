import React, { useState,useEffect } from 'react';
import { Container} from 'reactstrap'
import styles from "../styles/Login.module.css";
import { useRouter } from 'next/router';
import Nprogress from 'nprogress'
import { callOtherApi } from '../Helper/helper';
const MailVerified =()=> {    
  const router = useRouter()
  const [box,setBox] = useState({
      type:null,
      message:""
  })
  const verifiedToken = async (token) =>{
      try {
          // await callOtherApi('https://oxens.ezxdemo.com/api/driver/auth/verification/web/verified',{verify_token:token},{'Accept':'application/json'})
          await callOtherApi('http://localhost:3043/driver/auth/verification/web/verified',{verify_token:token},{'Accept':'application/json'})
          setBox({
            type:1,
            message:''
          })
      } catch (error) {
            setBox({
                type:0,
                message:error.message
            })
      }
  }
  useEffect(()=>{
    if (router.query.token) {
        verifiedToken(router.query.token)
    }
  },[router.query.token])
  return (
    <>
      <section className={`${styles.formSection} `}>
        <Container> 
                     
                {
                    box.type!==null?
                        <div className={`${styles.formWrap} formWrap`}> 
                            {
                                box.type?
                                    <div className={`${styles.formTitle}`}>
                                        <h3>Email Verified</h3>
                                        <p>Your mail address successfully verified. Please login by app.</p>
                                    </div>
                                :
                                    <div className={`${styles.formTitle}`}>
                                        <h3>{box.message}</h3>
                                    </div>
                            }
                        </div>                            
                    :
                    null    
                }
         
        </Container>
      </section> 
    </>
  )

}
export default MailVerified;