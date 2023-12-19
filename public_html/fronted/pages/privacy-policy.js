import React, { useEffect, useState } from 'react';
import IinnerLayout from "../layouts/linnerlayout"
import { Container} from 'reactstrap'
import styles from "../styles/cmsPage.module.css";
import { callApi } from '../Helper/helper';
import { useRouter } from 'next/router';
import nProgress from 'nprogress';
import moment from 'moment';
const PrivacyPolicy =()=> { 
  const [pageData,setPageData] = useState(null)
  const router = useRouter()
  const getPageData = async() =>{
    try {
      let res = await callApi('post','/front/cms',{slug:"privacy-policy"}) 
      nProgress.done()
      setPageData(res.data.data) 
    } catch (error) {
      router.back();
    }
  }
  useEffect(() => {
    nProgress.start()
    getPageData()
  }, []);
  return (
    <>
      <section className={`${styles.cmsBanner}`}>
        <Container>
            <h2>{pageData?pageData.title:''}</h2>
            <p>Last updated on {pageData?moment(pageData.updatedAt).format("MMMM D,  YYYY"):""}.</p>
        </Container>
      </section> 

      <section className={`${styles.cmsWrap}`}>
        <Container>
          <div className={`${styles.cmsWrapInner}`} dangerouslySetInnerHTML={{__html:pageData?pageData.content:''}}></div>
        </Container>
      </section>
    </>
  )

}
PrivacyPolicy.layout = IinnerLayout
export default PrivacyPolicy;